// routes/mysql/sqlRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const SqlService = require("../../services/sqlService");
const router = express.Router();

//////////////////////
// MULTER (Imagen)
//////////////////////

const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "_" + uniqueName);
  }
});

const upload = multer({ storage });

// === RUTA POST PERSONA CON IMAGEN ===
router.post("/post-person", upload.single("image"), async (req, res) => {
  console.log("POST /post-person recibido");
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  const { name, edad, sex, homes_id_homes } = req.body;

  if (!name || edad === undefined || !sex || !homes_id_homes) {
    return res.status(400).send("Faltan campos obligatorios.");
  }

  const db = new SqlService();
  const tableName = "person";
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query(
      `INSERT INTO ${tableName} (name, edad, sex, homes_id_homes, image_url) VALUES (?, ?, ?, ?, ?)`,
      [name, edad, sex, homes_id_homes, image_url]
    );
    res.status(201).send("Persona registrada correctamente.");
  } catch (err) {
    console.error("Error SQL:", err);
    if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_REFERENCED_ROW") {
      return res.status(400).send("Error: el hogar (homes_id_homes) no existe.");
    }
    res.status(500).send("Error creando la persona.");
  } finally {
    await db.closeConnection();
  }
});

//////////////////////
// PERSON
//////////////////////

router.get('/get-all-person', async (req, res) => {
  const db = new SqlService();
  const tableName = "person";
  try {
    const data = await db.query(`SELECT * FROM ${tableName}`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching persons.");
  } finally {
    await db.closeConnection();
  }
});

router.get('/get-one-person/:id_card', async (req, res) => {
  const db = new SqlService();
  const tableName = "person";
  try {
    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id_card = ?`,
      [req.params.id_card]
    );

    if (result.length === 0) {
      res.status(404).send("Person not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving person.");
  } finally {
    await db.closeConnection();
  }
});

//////////////////////
// HOGARES
//////////////////////
router.post('/post-home', async (req, res) => {
  const { id_homes, address, social_stratum, municipality } = req.body;

  if (!address || social_stratum === undefined || !municipality) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  const tableName = "home";
  try {
    
    if (id_homes) {
      await db.query(
        `INSERT INTO ${tableName} (id_homes, address, social_stratum, municipality) VALUES (?, ?, ?, ?)`,
        [id_homes, address, social_stratum, municipality]
      );
    } else {
      const result = await db.query(
        `INSERT INTO ${tableName} (address, social_stratum, municipality) VALUES (?, ?, ?)`,
        [address, social_stratum, municipality]
      );
    }
    res.status(201).send("Home created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating home.");
  } finally {
    await db.closeConnection();
  }
});

router.get('/get-all-home', async (req, res) => {
  const db = new SqlService();
  const tableName = "home";
  try {
    const data = await db.query(`SELECT * FROM ${tableName}`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching homes.");
  } finally {
    await db.closeConnection();
  }
});

router.get('/get-one-home/:id_homes', async (req, res) => {
  const db = new SqlService();
  const tableName = "home";
  try {
    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id_homes = ?`,
      [req.params.id_homes]
    );

    if (result.length === 0) {
      res.status(404).send("Home not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving home.");
  } finally {
    await db.closeConnection();
  }
});



//////////////////////
// PROGRAMAS (relation N:M)
//////////////////////

router.post('/post-program-beneficiary', async (req, res) => {
  const { social_program_id, beneficiary_id } = req.body;

  if (!social_program_id || !beneficiary_id) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  const tableName = "programs_has_beneficiaries";
  try {
    await db.query(
      `INSERT INTO ${tableName} (social_programs_idsocial_programs, program_beneficiaries_idprogram_beneficiaries) VALUES (?, ?)`,
      [social_program_id, beneficiary_id]
    );
    res.status(201).send("Program-beneficiary relation saved successfully!");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating relation.");
  } finally {
    await db.closeConnection();
  }
});


router.post('/post-programs', async (req, res) => {
  
  const { social_program_id, beneficiary_id } = req.body;
  if (!social_program_id || !beneficiary_id) {
    return res.status(400).send("Missing fields.");
  }
  const db = new SqlService();
  const tableName = "programs_has_beneficiaries";
  try {
    await db.query(
      `INSERT INTO ${tableName} (social_programs_idsocial_programs, program_beneficiaries_idprogram_beneficiaries) VALUES (?, ?)`,
      [social_program_id, beneficiary_id]
    );
    res.status(201).send("Program-beneficiary (alias) saved successfully!");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating relation.");
  } finally {
    await db.closeConnection();
  }
});

router.get('/get-all-program', async (req, res) => {
  const db = new SqlService();
  const tableName = "programs";
  try {
    const data = await db.query(`SELECT * FROM ${tableName}`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching programs.");
  } finally {
    await db.closeConnection();
  }
});

router.get('/get-one-program/:id_programs', async (req, res) => {
  const db = new SqlService();
  const tableName = "programs";
  try {
    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id_programs = ?`,
      [req.params.id_programs]
    );

    if (result.length === 0) {
      res.status(404).send("Program not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving program.");
  } finally {
    await db.closeConnection();
  }
});

//////////////////////
// BENEFICIARIOS
//////////////////////

router.post('/post-beneficiary', async (req, res) => {
  const { admission_date, person_id_person } = req.body;

  if (!admission_date || !person_id_person) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  const tableName = "beneficiaries";

  try {
    await db.query(
      `INSERT INTO ${tableName} (admission_date, person_id_person) VALUES (?, ?)`,
      [admission_date, person_id_person]
    );
    res.status(201).send("Beneficiary created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating beneficiary.");
  } finally {
    await db.closeConnection();
  }
});

router.get('/get-all-beneficiary', async (req, res) => {
  const db = new SqlService();
  const tableName = "beneficiaries";
  try {
    const data = await db.query(`SELECT * FROM ${tableName}`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching beneficiaries.");
  } finally {
    await db.closeConnection();
  }
});

router.get('/get-one-beneficiary/:id_beneficiaries', async (req, res) => {
  const db = new SqlService();
  const tableName = "beneficiaries";
  try {
    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id_beneficiaries = ?`,
      [req.params.id_beneficiaries]
    );

    if (result.length === 0) {
      res.status(404).send("Beneficiary not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving beneficiary.");
  } finally {
    await db.closeConnection();
  }
});

//////////////////////
// ETL Importa
//////////////////////
router.get('/etl-firebase-to-mysql', async (req, res) => {
  try {
    const firebase = require('../../services/firebaseService');
    const sql = new SqlService();

    const houses = await firebase.getAllHouses();

    for (const h of houses) {
      await sql.query(
        "INSERT INTO home (id_homes, address, municipality, social_stratum) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE address=?, municipality=?, social_stratum=?",
        [
          h.id, 
          h.address, 
          h.municipality, 
          h.social_stratum, 
          h.address, 
          h.municipality, 
          h.social_stratum
        ]
      );
    }

    res.json({ message: "ETL completado: Firebase → MySQL" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ejecutando ETL" });
  }
});


module.exports = router;
