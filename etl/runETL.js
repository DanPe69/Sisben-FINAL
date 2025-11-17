// etl/runETL.js

const firebase = require("../services/firebaseService");
const sql = require("../services/sqlService");

async function runETL() {
  console.log("Ejecutando ETL…");

  const homes = await firebase.getAllHouses();

  for (const h of homes) {
    await sql.insertHome({
      id_homes: h.id,
      address: h.address,
      municipality: h.municipality,
      social_stratum: h.social_stratum
    });
  }

  console.log(`ETL completado: ${homes.length} hogares procesados`);
}

module.exports = runETL;
