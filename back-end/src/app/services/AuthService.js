// src/app/services/AuthService.js
const db = require("../../configs/DatabaseConfig.js");
const bcrypt = require("bcrypt");
const HandleCode = require("../../utilities/HandleCode.js");

module.exports.login = async (email, password) => {
  try {
    const [rows] = await db.query(
      `SELECT UserId, Username, Password, Avatar, IsBanned, Coins, RoleId FROM users WHERE Email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return { code: HandleCode.LOGIN_FAILED };
    }

    const userId = rows[0].UserId;
    const username = rows[0].Username;
    const storedPassword = rows[0].Password;
    const avatar = rows[0].Avatar;
    const IsBanned = rows[0].IsBanned;
    const coins = rows[0].Coins;
    const roleId = rows[0].RoleId;

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (IsBanned == 1) {
      return { code: HandleCode.ACCOUNT_BANNED };
    }

    if (isMatch) {
      return {
        code: HandleCode.LOGIN_SUCCESS,
        userInfo: {
          userId: userId,
          username: username,
          avatar: avatar,
          coins: coins,
          roleId: roleId,
        },
      };
    } else {
      return { code: HandleCode.LOGIN_FAILED };
    }
  } catch (err) {
    throw err;
  }
};
