// firebaseETL.js -> Este script extrae datos desde Firebase Firestore inserta en las tablas MySQL

import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase.js"; // tu conexión a Firebase
import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sisben",
});

console.log("🔄 Iniciando proceso ETL desde Firebase hacia MySQL...");

try {
  // Leer los datos desde Firebase
  const snapshot = await getDocs(collection(db, "home")); // nombre de la colección
  const homes = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    homes.push({
      address: data.address,
      social_stratum: data.social_stratum,
      municipality: data.municipality,
    });
  });

  console.log(`📦 ${homes.length} registros encontrados en Firebase`);

  // Insertar en la tabla home
  for (const home of homes) {
    await conn.query(
      "INSERT INTO home (address, social_stratum, municipality) VALUES (?, ?, ?)",
      [home.address, home.social_stratum, home.municipality]
    );
  }

  console.log("✅ Datos insertados correctamente en MySQL.");
} catch (error) {
  console.error("❌ Error en ETL:", error);
} finally {
  await conn.end();
}
