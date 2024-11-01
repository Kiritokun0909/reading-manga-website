require('dotenv').config(); // Load environment variables

const jwt = require('jsonwebtoken');
const userService = require('../app/services/UserService.js');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

const authorizeRole = (requiredRole) => {
  return async (req, res, next) => {
    const userRole = await userService.getUserRole(req.user.id);
    if (userRole !== requiredRole) {
      return res.status(403).send('Access denied. Insufficient permissions.');
    }
    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authorizeRole
};
