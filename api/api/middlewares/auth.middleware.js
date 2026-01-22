const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).send({
      message: "Token manquant. Accès refusé."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ajoute les infos utilisateur à la requête
    next();
  } catch (err) {
    return res.status(403).send({
      message: "Token invalide ou expiré."
    });
  }
};

module.exports = verifyToken;
