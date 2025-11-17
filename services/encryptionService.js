// services/encryptionService.js

// Encriptar texto con desplazamiento simple (sin librerías externas)
function encryptPassword(password) {
  const shift = 5; // desplazamiento de caracteres
  let encrypted = '';

  for (let i = 0; i < password.length; i++) {
    encrypted += String.fromCharCode(password.charCodeAt(i) + shift);
  }
  return encrypted;
}

// Desencriptar texto
function decryptPassword(encrypted) {
  const shift = 5;
  let decrypted = '';

  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(encrypted.charCodeAt(i) - shift);
  }
  return decrypted;
}

module.exports = { encryptPassword, decryptPassword };
