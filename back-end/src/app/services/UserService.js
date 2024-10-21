// src/app/services/UserService.js
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

module.exports.register = async (username = "user", email, password, role) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [] = await db.query(
      `
            INSERT INTO users (
                \`Username\`,
                \`Email\`,
                \`Password\`,
                \`RoleID\`
            ) VALUES (?, ?, ?, ?)
        `,
      [username, email, hashedPassword, role]
    );

    return { code: HandleCode.REGISTER_SUCCESS };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { code: HandleCode.EMAIL_EXIST };
    }

    throw err;
  }
};

module.exports.getUserInfo = async (userId) => {
  try {
    const [rows] = await db.query(
      `
            SELECT Username, Email, Avatar, Birthday, Gender, IsBanned FROM users WHERE UserId = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return { code: HandleCode.USER_NOT_FOUNDED };
    }

    return { code: HandleCode.GET_USER_INFO_SUCCESS, userInfo: rows[0] };
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserInfo = async (
  userId,
  username,
  avatar,
  birthday,
  gender
) => {
  try {
    const [rows] = await db.query(
      `
            UPDATE users
            SET
                Username = ?,
                Avatar = ?,
                Birthday = ?,
                Gender = ?
            WHERE UserId = ?`,
      [username, avatar, birthday, gender, userId]
    );

    if (rows.affectedRows === 0) {
      return { code: HandleCode.USER_NOT_FOUNDED };
    }

    return { code: HandleCode.UPDATE_USER_SUCCESS };
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserEmail = async (userId, email) => {
  try {
    const [rows] = await db.query(
      `
            UPDATE users
            SET
                Email = ?
            WHERE UserId = ?`,
      [email, userId]
    );

    if (rows.affectedRows === 0) {
      return { code: HandleCode.USER_NOT_FOUNDED };
    }

    return { code: HandleCode.UPDATE_USER_SUCCESS };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { code: HandleCode.EMAIL_EXIST };
    }

    throw err;
  }
};

module.exports.updateUserPassword = async (userId, oldPassword, newPassword) => {
  try {
    const [row] = await db.query(
      `SELECT Password FROM users WHERE UserId = ?`,
      [userId]
    );

    if (row.length === 0) {
      return { code: HandleCode.USER_NOT_FOUNDED };
    }

    const storedPassword = row[0].Password;
    const isMatch = await bcrypt.compare(oldPassword, storedPassword);

    if (!isMatch) {
      return { code: HandleCode.PASSWORD_NOT_MATCH };
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const [] = await db.query(
      `
            UPDATE users
            SET
                Password = ?
            WHERE UserId = ?`,
      [hashedPassword, userId]
    );

    return { code: HandleCode.UPDATE_USER_SUCCESS };
  } catch (err) {
    throw err;
  }
};
