const express = require("express");
const router = express.Router();

const svc = require("../../services/firebaseService"); 
const SqlService = require("../../services/sqlService");

// ================================
//   ETL Firebase → MySQL
// ================================
router.get("/import-homes", async (req, res) => {
  try {
    const firebaseHomes = await svc.getAllHouses();

    const sql = new SqlService();

    let inserted = 0;
    let skipped = 0;

    for (const home of firebaseHomes) {
      if (!home.id) continue;

      const exists = await sql.checkHomeExists(home.id);

      if (exists) {
        skipped++;
        continue;
      }

      await sql.insertHome({
        id_homes: home.id,
        address: home.address,
        municipality: home.municipality,
        social_stratum: home.social_stratum,
      });

      inserted++;
    }

    return res.json({
      ok: true,
      imported: inserted,
      skipped,
      message: `ETL completado. Insertados: ${inserted}, ignorados: ${skipped}`,
    });

  } catch (err) {
    console.error("Error en ETL Firebase → MySQL:", err);
    return res.status(500).json({ ok: false, error: "Error ejecutando ETL" });
  }
});


module.exports = router;
