const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const mangaService = require("./MangaService.js");

module.exports.getListChapterByMangaId = async (mangaId) => {
  try {
    const [rows] = await db.query(
      `SELECT chapterId, volumeNumber, chapterNumber, chapterName, publishedDate, isFree 
      FROM chapters 
      WHERE mangaId = ? 
      ORDER BY chapterNumber DESC`,
      [mangaId]
    );
    return {
      mangaId: mangaId,
      chapters: rows,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.getChapterInfoByChapterId = async (chapterId) => {
  try {
    const [rows] = await db.query(
      `SELECT chapterId, volumeNumber, chapterNumber, chapterName, publishedDate, isFree 
      FROM chapters 
      WHERE chapterId = ?`,
      [chapterId]
    );
    return {
      chapterInfo: rows[0],
    };
  } catch (error) {
    throw error;
  }
};

module.exports.addChapter = async (
  mangaId,
  volumeNumber,
  chapterNumber,
  chapterName,
  publishedDate,
  novelContext,
  isFree
) => {
  try {
    const [rows] = await db.query(
      `INSERT INTO chapters (mangaId, volumeNumber, chapterNumber, chapterName, publishedDate, novelContext, isFree)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mangaId,
        volumeNumber,
        chapterNumber,
        chapterName,
        publishedDate,
        novelContext,
        isFree,
      ]
    );
    const [countRows] = await db.query(
      `SELECT COUNT(chapterId) as total FROM chapters WHERE mangaId = ?`,
      [mangaId]
    );
    const result = mangaService.updateMangaNewChapter(
      mangaId,
      chapterNumber,
      countRows[0].total
    );
    return { chapterId: rows.insertId };
  } catch (error) {
    throw error;
  }
};

module.exports.updateChapterInfo = async (
  chapterId,
  volumeNumber,
  chapterNumber,
  chapterName,
  publishedDate,
  isFree
) => {
  try {
    const [rows] = await db.query(
      `UPDATE chapters
      SET volumeNumber = ?, chapterNumber = ?, chapterName = ?, publishedDate = ?, isFree = ?
      WHERE chapterId = ?`,
      [
        volumeNumber,
        chapterNumber,
        chapterName,
        publishedDate,
        isFree,
        chapterId,
      ]
    );

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (error) {
    throw error;
  }
};

module.exports.deleteChapter = async (chapterId) => {
  try {
    const [rows] = await db.query(`DELETE FROM chapters WHERE chapterId = ?`, [
      chapterId,
    ]);

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (error) {
    throw error;
  }
};

module.exports.getChapterNovelContext = async (chapterId) => {
  try {
    const [rows] = await db.query(
      `SELECT novelContext 
      FROM chapters 
      WHERE chapterId = ?`,
      [chapterId]
    );

    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    return {
      novelContext: rows[0].novelContext,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.getChapterImages = async (chapterId) => {
  try {
    const [rows] = await db.query(
      `SELECT orderNumber, imageUrl
       FROM images 
       WHERE ChapterID = ? 
       ORDER BY OrderNumber`,
      [chapterId]
    );
    return {
      chapterId: chapterId,
      chapterImages: rows,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.updateChapterNovelContext = async (chapterId, novelContext) => {
  try {
    const [rows] = await db.query(
      `UPDATE chapters 
      SET novelContext = ? 
      WHERE chapterId = ?`,
      [novelContext, chapterId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (error) {
    throw error;
  }
};

module.exports.updateChapterImages = async (chapterId, chapterImages) => {
  try {
    const [rows] = await db.query(`DELETE FROM images WHERE ChapterID = ?`, [
      chapterId,
    ]);

    for (let i = 0; i < chapterImages.length; i++) {
      const [row] = await db.query(
        `
          INSERT INTO images(
              \`ChapterID\`,
              \`OrderNumber\`,
              \`ImageUrl\`
          ) VALUES(?, ?, ?);
        `,
        [chapterId, chapterImages[i].orderNumber, chapterImages[i].imageUrl]
      );
    }
  } catch (err) {
    throw err;
  }
};
