const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const passport = require("passport");
const session = require("express-session");
const profileRoutes = require("./routes/profile");
const searchRoutes = require("./routes/search");
const exchangeRoutes = require("./routes/exchange");
const messageRoutes = require("./routes/messages"); // nueva ruta para historial de chat
const chatList = require("./routes/chatslist");
const { Server } = require("socket.io");
const http = require("http"); // NECESARIO para crear el servidor HTTP
const db = require("./config/db");

require("dotenv").config();

const app = express();
// Variables para el servidor Server.IO
const server = http.createServer(app); // Importante: Socket.IO usa este servidor
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

// Middlewares
app.use(cors({
  origin: "http://localhost:3000", // frontend
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "miSecreto", // obligatorio
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // en desarrollo, true si usas HTTPS
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());  // Autentificacion con Google

// Rutas API
app.use("/api/auth", authRoutes); // Autentificacion 
app.use("/api/profile", profileRoutes); // Perfil de usuario
app.use("/api/search", searchRoutes); // Busqueda 
app.use("/api/exchanges", exchangeRoutes); // Intermcabios
app.use("/api/messages", messageRoutes); //  Ruta para historial de mensajes
app.use("/api/chats", chatList);

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("InterSkill API funcionando...");
});

// Parte del servidor Server.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Unirse a una sala (por ID del intercambio)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Usuario ${socket.id} se unió a la sala ${roomId}`);
  });

  // Enviar mensaje
  socket.on("send_message", async (data) => {
    const { exchangeId, senderId, receiverId, message } = data;

    try {
      // Guardar mensaje en la BD
      await db
        .promise()
        .query(
          "INSERT INTO messages (exchange_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)",
          [exchangeId, senderId, receiverId, message]
        );

      // Enviar mensaje a los usuarios de la sala
      io.to(exchangeId).emit("receive_message", data);
    } catch (err) {
      console.error(" Error al guardar mensaje:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(" Usuario desconectado:", socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));