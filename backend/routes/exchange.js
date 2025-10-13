const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

// Crear nueva solicitud de intercambio
router.post("/", authMiddleware, async (req, res) => {
  const { received_id, skill_offered, skill_requested } = req.body;
  const sender_id = req.user.id;

  try {
    const [result] = await db.promise().query(
      "INSERT INTO exchanges (sender_id, received_id, skill_offered, skill_requested, status) VALUES (?, ?, ?, ?, 'pending')",
      [sender_id, received_id, skill_offered, skill_requested]
    );
    res.json({ message: "Solicitud enviada", exchangeId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear solicitud" });
  }
});

// Ver solicitudes (enviadas o recibidas)
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT e.*, u1.name as sender_name, u2.name as received_name
       FROM exchanges e
       JOIN users u1 ON e.sender_id = u1.id
       JOIN users u2 ON e.received_id = u2.id
       WHERE e.sender_id = ? OR e.received_id = ?`,
      [userId, userId]
    );
    res.json({
      userId,
      exchanges: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
});

// Actualizar estado de una solicitud (aceptar o rechazar)
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // accepted | rejected
  const userId = req.user.id;

  try {
    // Verificar que el usuario es el receptor de la solicitud
    const [rows] = await db.promise().query(
      "SELECT * FROM exchanges WHERE id = ? AND received_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: "No autorizado para actualizar esta solicitud" });
    }

    await db.promise().query("UPDATE exchanges SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: `Solicitud ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar solicitud" });
  }
});

// Obtener intercambios aceptados (para lista de chats)
router.get("/accepted", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT e.id as exchange_id, 
              CASE 
                WHEN e.sender_id = ? THEN u2.name 
                ELSE u1.name 
              END as partner_name,
              CASE 
                WHEN e.sender_id = ? THEN u2.id 
                ELSE u1.id 
              END as partner_id
       FROM exchanges e
       JOIN users u1 ON e.sender_id = u1.id
       JOIN users u2 ON e.received_id = u2.id
       WHERE (e.sender_id = ? OR e.received_id = ?)
       AND e.status = 'accepted'`,
      [userId, userId, userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener intercambios aceptados:", err);
    res.status(500).json({ error: "Error al obtener intercambios" });
  }
});

// Obtener historial de intercambios para /history
router.get("/history", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
          e.id,
          e.skill_offered,
          e.skill_requested,
          e.status,
          e.updated_at,
          e.sender_id,
          e.received_id,
          sender.name AS senderName,
          receiver.name AS receiverName
       FROM exchanges e
       JOIN users sender ON e.sender_id = sender.id
       JOIN users receiver ON e.received_id = receiver.id
       WHERE (e.sender_id = ? OR e.received_id = ?)
       AND e.status IN ('accepted', 'rejected')
       ORDER BY e.updated_at DESC`,
      [userId, userId]
    );
    //console.log("Historial obtenido:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ message: "Error al obtener historial" });
  }
});



module.exports = router;
