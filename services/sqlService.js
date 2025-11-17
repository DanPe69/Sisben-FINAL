const mysql = require("mysql2/promise");
const config = require("../env/mysqlConfig");

class SqlService {
  constructor() {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10
    });
  }

  async query(sql, params) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  // ============================
  //  VERIFICAR SI EL HOGAR EXISTE
  // ============================
  async checkHomeExists(id) {
    const rows = await this.query(
      "SELECT id_homes FROM home WHERE id_homes = ?",
      [id]
    );
    return rows.length > 0;
  }

  // ============================
  // INSERTAR HOGAR
  // ============================
  async insertHome(home) {
    return await this.query(
      "INSERT INTO home (id_homes, address, municipality, social_stratum) VALUES (?, ?, ?, ?)",
      [
        home.id_homes,
        home.address,
        home.municipality,
        home.social_stratum,
      ]
    );
  }
}

module.exports = SqlService;
