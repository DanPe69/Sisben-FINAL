// service/firebaseService.js
const admin = require('firebase-admin');
var serviceAccount = require("../env/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// ====================
// FUNCIONES FIREBASE
// ====================

// Crear hogar
async function createHouse(id, data) {
  await db.collection('home').doc(id).set(data);
}

// Obtener todos los hogares
async function getAllHouses() {
  const snapshot = await db.collection('home').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtener hogar por id
async function getHouseById(id) {
  const doc = await db.collection('home').doc(id).get();
  return doc.exists ? doc.data() : null;
}

// Agregar beneficiario
async function addBeneficiary(homeId, beneficiary) {
  const ref = db.collection('home').doc(homeId).collection('beneficiaries');
  await ref.add(beneficiary);
}

// Leer beneficiarios
async function getBeneficiaries(homeId) {
  const snapshot = await db.collection('home').doc(homeId).collection('beneficiaries').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Agregar programa
async function addProgram(homeId, program) {
  const ref = db.collection('home').doc(homeId).collection('programs');
  await ref.add(program);
}

// Leer programas
async function getPrograms(homeId) {
  const snapshot = await db.collection('home').doc(homeId).collection('programs').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  createHouse,
  getAllHouses,
  getHouseById,
  addBeneficiary,
  getBeneficiaries,
  addProgram,
  getPrograms
};
