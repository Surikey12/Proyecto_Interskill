const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener todas las conversaciones (por usuario)
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Buscando conversaciones para el usuario:", userId);

  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        m.exchange_id AS chat_id,
        -- El "otro usuario" de la conversación
        CASE 
          WHEN m.sender_id = ? THEN r.id 
          ELSE s.id 
        END AS partnerId,
        CASE 
          WHEN m.sender_id = ? THEN r.name 
          ELSE s.name 
        END AS partnerName,
        m.content AS lastMessage,
        m.created_at AS updatedAt
      FROM messages m
      JOIN users s ON s.id = m.sender_id
      JOIN users r ON r.id = m.receiver_id
      WHERE ? IN (m.sender_id, m.receiver_id)
      AND m.created_at = (
        SELECT MAX(created_at)
        FROM messages
        WHERE exchange_id = m.exchange_id
      )
      ORDER BY m.created_at DESC;
      `,
      [userId, userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener las conversaciones:", err);
    res.status(500).json({ message: "Error al obtener las conversaciones" });
  }
});

module.exports = router;
