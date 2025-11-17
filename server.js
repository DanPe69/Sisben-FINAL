const express = require('express');
const path = require('path');

const firebaseRoutes = require('./routes/firebase/firebaseRoutes');
const sqlRoutes = require('./routes/mysql/sqlRoutes');
const loginRoutes = require('./routes/loginRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// 🔵 Firebase para la INTERFAZ (frontend)
app.use('/nosql', firebaseRoutes);

// 🔴 Firebase para ETL (backend → MySQL)
app.use('/api/firebase', firebaseRoutes);

// Login
app.use('/auth', loginRoutes);

// MySQL
app.use('/sql', sqlRoutes);

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
