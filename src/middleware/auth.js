// src/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Checks if header exists and starts with "Bearer "
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This allows getRooms to use req.user
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
