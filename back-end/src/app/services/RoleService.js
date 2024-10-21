// src/app/services/RoleService.js
const db = require("../../configs/DatabaseConfig.js");

module.exports.getRoles = async () => {
  try {
    const [rows] = await db.query(`
            SELECT RoleId, RoleName FROM roles
        `);
    return {
      roles: rows,
    };
  } catch (err) {
    throw err;
  }
};
