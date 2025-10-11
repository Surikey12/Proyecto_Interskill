const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const db = require("../config/db"); // conexión a MySQL

// Obtener perfil del usuario logueado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Busca usuario
    const [userRows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [userId]);
    const user = userRows[0];
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Busca perfil
    const [profileRows] = await db.promise().query("SELECT * FROM profiles WHERE user_id = ?", [userId]);
    const profile = profileRows[0] || {};

    // Buscar habilidades
    const [skillsRows] = await db.promise().query("SELECT skill_name, type FROM skills WHERE user_id = ?", [userId]);

    // Separar ofertadas y buscadas 
    const skillsOffered = skillsRows.filter((s) => s.type === "offer").map((s) => s.skill_name);

    const skillsWanted = skillsRows.filter((s) => s.type === "want").map((s) => s.skill_name);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: profile.bio || "",
      location: profile.location || "",
      avatar: profile.avatar_url || null,
      skillsOffered,
      skillsWanted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo el perfil" });
  }
});

// Actualizar biografía
router.put("/bio", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio } = req.body;

    await db.promise().query("INSERT INTO profiles (user_id, bio) VALUES (?, ?) ON DUPLICATE KEY UPDATE bio = VALUES(bio)",[userId, bio]);

    res.json({ message: "Biografía actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando biografía" });
  }
});

// Actualizar ubicación
router.put("/location", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { location } = req.body;

    await db
      .promise()
      .query(
        "INSERT INTO profiles (user_id, location) VALUES (?, ?) ON DUPLICATE KEY UPDATE location = VALUES(location)",
        [userId, location]
      );

    res.json({ message: "Ubicación actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando ubicación" });
  }
});

// Agregar habilidad
router.post("/skills", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill, type } = req.body; // type = "offer" | "want"

    if (!skill || !type) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    await db
      .promise()
      .query("INSERT INTO skills (user_id, skill_name, type) VALUES (?, ?, ?)", [
        userId,
        skill,
        type,
      ]);

    res.json({ message: "Habilidad agregada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error agregando habilidad" });
  }
});

// Eliminar habilidad
router.delete("/skills/:skillName/:type", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillName, type } = req.params;

    const [result] = await db
      .promise()
      .query(
        "DELETE FROM skills WHERE user_id = ? AND skill_name = ? AND type = ?",
        [userId, skillName, type]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Habilidad no encontrada" });
    }

    res.json({ message: "Habilidad eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando habilidad" });
  }
});

module.exports = router;