**InterSkill** es una plataforma web que conecta a personas del mismo lugar para **intercambiar habilidades** mediante un sistema de **chat en tiempo real**, **seguimiento de intercambios** y autenticación con **Google OAuth**.  
El objetivo del proyecto es fomentar el aprendizaje colaborativo y la creación de comunidades locales de conocimiento.

Tecnologías principales

**Frontend:**
-  React.js
-  Tailwind CSS
-  Axios
-  Socket.io Client

**Backend:**
-  Node.js
-  Express.js
-  MySQL (Base de datos relacional)
-  JWT (autenticación con tokens)
-  Socket.io (mensajería en tiempo real)
-  Passport + Google OAuth 2.0 (inicio de sesión con Google)

Configuración del entorno

Antes de ejecutar el proyecto, asegúrate de crear el archivo `.env` en el **backend**, con las siguientes variables:

```env
# Archivo: /.env

PORT=5000
JWT_SECRET=tu_clave_secreta
SESSION_SECRET=tu_clave_de_sesion

# Credenciales de Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=interskill 
```
Instalación y ejecución

Clonar el repositorio
git clone https://github.com/tuusuario/ruta_repositorio
cd PlataformaHabilidades

Para el backend
En la carpeta principal se encuentra el servidor asi que desde ahi:
Instala las dependencias:
npm install

Inicia el servidor:
npm start

El backend se ejecutará en:
http://localhost:5000

Para el backend
Entra a la carpeta del frontend:
cd frontend

Instala las dependencias:
npm install

Inicia la aplicación:
npm start

El frontend se ejecutará en:
http://localhost:3000


Base de datos (MySQL)

Principales tablas utilizadas:
users → manejo de usuarios y credenciales
exchanges → registro de solicitudes de intercambio
messages → historial de conversaciones
skills → catálogo de habilidades disponibles