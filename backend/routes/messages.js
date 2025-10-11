const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

// Obtener historial de mensajes en el intercambio 
router.get("/:exchangeId", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { exchangeId } = req.params;
  try {
    
    // Validar que el usuario pertenece al intercambio
    const [exchange] = await db.promise().query(
    "SELECT * FROM exchanges WHERE id = ? AND (sender_id = ? OR received_id = ?)",
    [exchangeId, userId, userId]
    );

    if (exchange.length === 0) {
    return res.status(403).json({ error: "No autorizado para ver esta conversación" });
    }

    const [rows] = await db
      .promise()
      .query(
        `SELECT id, sender_id AS senderId, receiver_id AS receiverId, content AS message, created_at AS createdAt 
         FROM messages 
         WHERE exchange_id = ?
         ORDER BY created_at ASC`,
        [exchangeId]
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

module.exports = router;