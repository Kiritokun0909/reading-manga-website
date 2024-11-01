// src/app/services/UserService.js
const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const mangaService = require("./MangaService.js");

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

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { code: HandleCode.EMAIL_EXIST };
    }

    throw err;
  }
};

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

module.exports.getUserById = async (userId) => {
  try {
    const [rows] = await db.query(
      `
            SELECT username, email, avatar, birthday, gender, isBanned 
            FROM users WHERE userId = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    return { userInfo: rows[0] };
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserInfo = async (
  userId,
  username="",
  avatar="",
  birthday="",
  gender=null
) => {
  try {
    // Initialize arrays to hold the fields to update and the values
    const fields = [];
    const values = [];

    // Dynamically add fields that are not null or empty
    if (username && username.trim().length > 0) {
      fields.push("Username = ?");
      values.push(username);
    }
    if (avatar && avatar.trim().length > 0) {
      fields.push("Avatar = ?");
      values.push(avatar);
    }
    if (birthday) {
      fields.push("Birthday = ?");
      values.push(birthday);
    }
    if (gender !== null && gender.trim().length > 0) { // Allow for possible falsy values like 0
      fields.push("Gender = ?");
      values.push(gender);
    }

    // If there are no fields to update, return an appropriate response
    if (fields.length === 0) {
      return { code: HandleCode.NO_FIELDS_TO_UPDATE };
    }

    // Add userId to the values array
    values.push(userId);

    // Construct the dynamic query
    const query = `UPDATE users SET ${fields.join(", ")} WHERE UserId = ?`;

    const [rows] = await db.query(query, values);

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

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
      return { code: HandleCode.NOT_FOUND };
    }

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { code: HandleCode.EMAIL_EXIST };
    }

    throw err;
  }
};

module.exports.updateUserPassword = async (
  userId,
  oldPassword,
  newPassword
) => {
  try {
    const [row] = await db.query(
      `SELECT Password FROM users WHERE UserId = ?`,
      [userId]
    );

    if (row.length === 0) {
      return { code: HandleCode.NOT_FOUND };
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

  } catch (err) {
    throw err;
  }
};

module.exports.banUser = async (userId) => {
  try {
    const [rows] = await db.query(
      `
            UPDATE users
            SET
                IsBanned = 1
            WHERE UserId = ?`,
      [userId]
    );

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

  } catch (err) {
    throw err;
  }
}

//#region like-unlike-manga
module.exports.likeManga = async (mangaId, userId) => {
  try {
    const [rows] = await db.query(
      "INSERT INTO likes (mangaId, userId) VALUES (?, ?)",
      [mangaId, userId]
    );
    await mangaService.updateMangaLikes(mangaId);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { code: HandleCode.USER_ALREADY_LIKE };
    }
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return { code: HandleCode.NOT_FOUND };
    }
    throw err;
  }
}

module.exports.unlikeManga = async (mangaId, userId) => {
  try {
    const [rows] = await db.query(
      "DELETE FROM likes WHERE mangaId = ? AND userId = ?",
      [mangaId, userId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
    await mangaService.updateMangaLikes(mangaId, false);
  } catch (err) {
    throw err;
  }
}
//#endregion

//#region follow-unfollow-manga
module.exports.followManga = async (mangaId, userId) => {
  try {
    const [rows] = await db.query(
      "INSERT INTO follows (mangaId, userId) VALUES (?, ?)",
      [mangaId, userId]
    );
    await mangaService.updateMangaFollows(mangaId);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { code: HandleCode.USER_ALREADY_FOLLOW };
    }
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return { code: HandleCode.NOT_FOUND };
    }
    throw err;
  }
}

module.exports.unfollowManga = async (mangaId, userId) => {
  try {
    const [rows] = await db.query(
      "DELETE FROM follows WHERE mangaId = ? AND userId = ?",
      [mangaId, userId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
    await mangaService.updateMangaFollows(mangaId, false);
  } catch (err) {
    throw err;
  }
}
//#endregion

//#region check user like-follow-manga
module.exports.isLikeManga = async (mangaId, userId) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM likes WHERE mangaId = ? AND userId = ?",
      [mangaId, userId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
}

module.exports.isFollowManga = async (mangaId, userId) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM follows WHERE mangaId = ? AND userId = ?",
      [mangaId, userId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
}
//#endregion

//#region implement get-list-like-follow
module.exports.getListLikeManga = async (userId, pageNumber, itemsPerPage) => {
  try {
    const [totalRows] = await db.query(
      "SELECT COUNT(UserId) as total FROM likes"
    );
    const totalMangas = totalRows[0].total;

    const totalPages = Math.ceil(totalMangas / itemsPerPage);
    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        mangas: [],
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT m.mangaId, m.coverImageUrl, m.mangaName, m.newestChapterNumber
        FROM likes l
          JOIN mangas m ON l.mangaId = m.mangaId 
        WHERE userId = ?
        LIMIT ? OFFSET ?`,
      [userId,itemsPerPage, offset]
    );

    return {
      pageNumber,
      totalPages,
      mangas: rows,
    };
  } catch (err) {
    throw err;
  }
}

module.exports.getListFollowManga = async (userId, pageNumber, itemsPerPage) => {
  try {
    const [totalRows] = await db.query(
      "SELECT COUNT(UserId) as total FROM likes"
    );
    const totalMangas = totalRows[0].total;

    const totalPages = Math.ceil(totalMangas / itemsPerPage);
    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        mangas: [],
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT m.mangaId, m.coverImageUrl, m.mangaName, m.newestChapterNumber
        FROM follows f
          JOIN mangas m ON f.mangaId = m.mangaId 
        WHERE userId = ?
        LIMIT ? OFFSET ?`,
      [userId,itemsPerPage, offset]
    );

    return {
      pageNumber,
      totalPages,
      mangas: rows,
    };
  } catch (err) {
    throw err;
  }
}
//#endregion