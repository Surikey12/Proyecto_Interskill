const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Registro
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Validación simple de email
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email no válido" });
  }

  try {
    const [existing] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ message: "Email ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword
    ]);

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Todos los campos son obligatorios" });

  try {
    const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ message: "Usuario no encontrado" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Estrategia de Google OAuth 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar si ya existe en DB
        const [existing] = await db
          .promise()
          .query("SELECT * FROM users WHERE email = ?", [profile.emails[0].value]);

        let user;
        if (existing.length > 0) {
          user = existing[0];
        } else {
          // Insertar nuevo usuario
          const [result] = await db
            .promise()
            .query(
              "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
              [profile.displayName, profile.emails[0].value, ""]
            );
          user = { id: result.insertId, name: profile.displayName, email: profile.emails[0].value };
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialización (para sesión con Passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// ---- Rutas de Google OAuth ----
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    // Crear token
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Redirigir al frontend con el token
    res.redirect(`http://localhost:3000/profile?token=${token}&userId=${req.user.id}&name=${encodeURIComponent(req.user.name)}`);
  }
);

module.exports = router;