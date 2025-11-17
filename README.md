# SisbénApp

SisbénApp es una aplicación web para la gestión de hogares y personas, inspirada en el sistema Sisbén colombiano. Permite registrar, consultar y actualizar información de hogares y sus miembros de forma sencilla y segura.

## Tecnologías

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Bases de datos: MySQL y Firebase Firestore

Extras: Multer (archivos), bcrypt (encriptación)

## Funcionalidades

Hogares: Crear, editar y eliminar hogares.

Personas: Registrar información personal, asociar personas a hogares.

Validaciones: Control de datos en frontend y backend.

Sincronización: Guardado en MySQL y Firebase.

## Instalación
git clone https://github.com/usuario/SisbenApp.git
cd SisbenApp
npm install


Coloca tu serviceAccountKey.json en la carpeta /env.

Ejecuta el servidor:

node server.js


Abre en tu navegador:

http://localhost:3000

##  Estructura principal
routes/       # Rutas Express
services/     # Servicios para Firebase y MySQL
public/       # Archivos estáticos
views/        # Vistas HTML
env/          # Configuración (Firebase)
server.js     # Servidor principal
package.json  # Dependencias

## Seguridad

Contraseñas encriptadas con bcrypt.

Validaciones estrictas para evitar datos incompletos o inválidos.

## Referencias

Node.js

Express.js

Firebase Firestore

MySQL