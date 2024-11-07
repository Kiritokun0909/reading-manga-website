const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const RoleEnum = {
  ADMIN: 1,
  USER: 2,
};

module.exports = {
  RoleEnum,
};

//#region login
module.exports.login = async (email, password) => {
  try {
    const [rows] = await db.query(
      `SELECT UserId, Password, Status, RoleId FROM users WHERE Email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return { code: HandleCode.LOGIN_FAILED };
    }

    const userId = rows[0].UserId;
    const storedPassword = rows[0].Password;
    const Status = rows[0].Status;
    const roleId = rows[0].RoleId;

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (Status == HandleCode.BAN_STATUS) {
      return { code: HandleCode.ACCOUNT_BANNED };
    }

    if (isMatch) {
      return {
        code: HandleCode.LOGIN_SUCCESS,
        userId: userId,
        roleId: roleId,
      };
    } else {
      return { code: HandleCode.LOGIN_FAILED };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region register
module.exports.register = async (email, password, roleId) => {
  try {
    const username = "user" + Math.floor(Math.random() * 1000000);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [] = await db.query(
      `
      INSERT INTO users (Email, Username, Password, RoleId) VALUES (?, ?, ?, ?)
      `,
      [email, username, hashedPassword, roleId]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { code: HandleCode.EMAIL_EXIST };
    }
    throw err;
  }
};
//#endregion

//#region get user role
module.exports.getUserRole = async (userId) => {
  try {
    const [rows] = await db.query(
      `
      SELECT RoleId 
      FROM users WHERE UserId = ?`,
      [userId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
    const roleId = rows[0].RoleId;
    return roleId;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region otp for reset password
module.exports.setOtp = async (email, otpCode, expiresAt) => {
  try {
    const [rows] = await db.query(
      `UPDATE users SET Otp = ?, OtpExpiresAt = ? WHERE Email = ?`,
      [otpCode, expiresAt, email]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};

module.exports.getOtpExpires = async (email, otpCode) => {
  try {
    const [rows] = await db.query(
      `SELECT UserId, OtpExpiresAt FROM users WHERE Email = ? AND Otp = ?`,
      [email, otpCode]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    const userId = rows[0].UserId;
    const expiresAt = rows[0].OtpExpiresAt;
    return { userId: userId, expiresAt: expiresAt };
  } catch (err) {
    throw err;
  }
};

module.exports.resetPassword = async (userId, resetPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(resetPassword, saltRounds);
    const [rows] = await db.query(
      `UPDATE users SET Password = ? WHERE UserId = ?`,
      [hashedPassword, userId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion
