// server.js ->Principal
const express = require('express');
const path = require('path');

const firebaseRoutes = require('./routes/firebase/firebaseRoutes');
const sqlRoutes = require('./routes/mysql/sqlRoutes');
const loginRoutes = require('./routes/loginRoutes');

const app = express();
const port = 3000;

// Middleware base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================
// RUTAS API — PRIMERO
// =============================
app.use('/auth', loginRoutes);
app.use('/api/firebase', firebaseRoutes);   // <-- ÚNICA RUTA FIREBASE
app.use('/sql', sqlRoutes);

// =============================
// ARCHIVOS ESTÁTICOS — DESPUÉS
// =============================
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
