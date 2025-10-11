const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

// Buscar usuarios por habilidad, tipo y ubicación
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { skill, type, location } = req.query;
    const currentUserId = req.user.id;

    let query = `
      SELECT u.id, u.name, u.email, p.location, p.avatar_url, s.skill_name, s.type,
        (
          SELECT GROUP_CONCAT(skill_name SEPARATOR ', ')
          FROM skills
          WHERE user_id = u.id AND type = 'offer'
        ) AS skills_offered
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN skills s ON u.id = s.user_id
      WHERE u.id <> ?
    `;
    let params = [currentUserId];

    // Normalizar búsqueda por habilidad (case-insensitive y tildes ignoradas)
    if (skill) {
      query += ` AND LOWER(CONVERT(s.skill_name USING utf8)) LIKE LOWER(CONVERT(? USING utf8))`;
      params.push(`%${skill}%`);
    }

    if (type) {
      query += " AND s.type = ?";
      params.push(type);
    }

    if (location) {
      query += ` AND LOWER(CONVERT(p.location USING utf8)) LIKE LOWER(CONVERT(? USING utf8))`;
      params.push(`%${location}%`);
    }

    const [rows] = await db.promise().query(query, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en la búsqueda" });
  }
});

module.exports = router;
