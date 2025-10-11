const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  //console.log("Authorization recibido:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Acceso denegado, token faltante :(" });
  }

  const token = authHeader.replace("Bearer ", "");
  //console.log("Token extraído:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Aquí tendremos el user.id
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware;
