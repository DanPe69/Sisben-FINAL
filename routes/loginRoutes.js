const express = require("express");
const bcrypt = require("bcrypt");
const SqlService = require("../services/sqlService");
const router = express.Router();

// === REGISTRAR NUEVO USUARIO ===
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const db = new SqlService();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password_encrypted) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (err) {
    console.error("Error SQL:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "El usuario ya existe." });
    }
    res.status(500).json({ error: "Error registrando el usuario." });
  } finally {
    await db.closeConnection();
  }
});

// === LOGIN DE USUARIO ===
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const db = new SqlService();

  try {
    const [user] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const match = await bcrypt.compare(password, user.password_encrypted);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Error SQL:", err);
    res.status(500).json({ error: "Error al iniciar sesión." });
  } finally {
    await db.closeConnection();
  }
});

module.exports = router;
