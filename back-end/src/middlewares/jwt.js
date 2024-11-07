require("dotenv").config(); // Load environment variables

const jwt = require("jsonwebtoken");
const authService = require("../app/services/AuthService.js");

const generateToken = (userId, type = "access") => {
  const secretKey =
    type == "access"
      ? process.env.JWT_ACCESS_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET;
  const expiresIn =
    type == "access"
      ? process.env.JWT_ACCESS_TOKEN_EXPIRE
      : process.env.JWT_REFRESH_TOKEN_EXPIRE;
  return jwt.sign({ id: userId }, secretKey, { expiresIn });
};

const verifyAccessToken = (req, res, next) => {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    return res.status(401).send("Access denied. No access token provided.");
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Access token expired.");
  }
};

const verifyRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).send("Refresh token expired.");
  }
};

const authorizeRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const userRoleId = await authService.getUserRole(req.user.id);

      if (!requiredRoles.includes(userRoleId)) {
        return res.status(403).send("Access denied. Insufficient permissions.");
      }
      next();
    } catch (error) {
      res.status(500).send("Internal server error.");
    }
  };
};

module.exports = {
  generateToken,
  verifyAccessToken,
  verifyRefreshToken,
  authorizeRole,
};
