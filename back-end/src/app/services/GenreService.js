// src/app/services/RoleService.js
const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");

module.exports.getGenres = async () => {
  try {
    const [rows] = await db.query(`
            SELECT genreId, genreName FROM genres
        `);
    return {
      genres: rows,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.addGenre = async (genreName) => {
  try {
    const [] = await db.query(
      `
            INSERT INTO genres (genreName)
            VALUES (?);
        `,
      [genreName]
    );

  } catch (err) {
    throw err;
  }
};

module.exports.updateGenre = async (genreId, genreName) => {
  try {
    const [rows] = await db.query(
      `
            UPDATE genres
            SET
                genreName = ?
            WHERE genreId = ?
        `,
      [genreName, genreId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

  } catch (err) {
    throw err;
  }
}

module.exports.removeGenre = async (genreId) => {
  try {
    const [rows] = await db.query(
      `
            DELETE FROM genres
            WHERE genreId = ?
        `,
      [genreId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

  } catch (err) {
    throw err;
  }
}