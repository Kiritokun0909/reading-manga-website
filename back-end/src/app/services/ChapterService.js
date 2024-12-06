const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const mangaService = require("./MangaService.js");
const { formatISODate } = require("../../utilities/utils.js");

//#region get list chapter
module.exports.getListChapterByMangaId = async (mangaId) => {
  try {
    const [rows] = await db.query(
      `SELECT chapterId, volumeNumber, chapterNumber, chapterName, updateAt 
      FROM chapters 
      WHERE mangaId = ? 
      ORDER BY volumeNumber DESC, chapterNumber DESC`,
      [mangaId]
    );

    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    const formattedChapters = rows.map((chapter) => ({
      ...chapter,
      updateAt: formatISODate(chapter.updateAt),
    }));

    return {
      chapters: formattedChapters,
    };
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region chapter-info
module.exports.getChapterInfoByChapterId = async (chapterId) => {
  try {
    const [rows] = await db.query(
      `SELECT chapterId, volumeNumber, chapterNumber, chapterName, publishedDate 
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
//#endregion

//#region add chapter
module.exports.addChapter = async (
  mangaId,
  volumeNumber,
  chapterNumber,
  chapterName,
  novelContext = ""
) => {
  try {
    const [insertRow] = await db.query(
      `INSERT INTO chapters (mangaId, volumeNumber, chapterNumber, chapterName, novelContext)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [mangaId, volumeNumber, chapterNumber, chapterName, novelContext]
    );

    const chapterId = insertRow.insertId;
    await mangaService.updateMangaNewChapterNumber(mangaId, chapterNumber);

    return { chapterId: chapterId };
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return { code: HandleCode.NOT_FOUND };
    }

    throw err;
  }
};
//#endregion

//#region update-chapter
module.exports.updateChapter = async (
  chapterId,
  volumeNumber,
  chapterNumber,
  chapterName,
  novelContext
) => {
  try {
    const [rows] = await db.query(
      `UPDATE chapters
      SET volumeNumber = ?, chapterNumber = ?, chapterName = ?, novelContext = ?
      WHERE chapterId = ?`,
      [volumeNumber, chapterNumber, chapterName, novelContext, chapterId]
    );

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region get-chapter
module.exports.getChapter = async (chapterId) => {
  try {
    const [chapterInfoRows] = await db.query(
      `SELECT 
            current.chapterId,
            current.volumeNumber,
            current.chapterNumber,
            current.chapterName,
            mangainfo.mangaName,
            mangainfo.isManga,
            current.mangaId
        FROM chapters AS current
        JOIN mangas as mangainfo
          ON current.MangaId = mangainfo.MangaId
        WHERE current.ChapterId = ?
        LIMIT 1;
    `,
      [chapterId]
    );

    if (chapterInfoRows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    const [chapterNovelRows] = await db.query(
      `
        SELECT novelContext
        FROM chapters 
        WHERE ChapterId = ?;
    `,
      [chapterId]
    );

    const [chapterImageRows] = await db.query(
      `
        SELECT pageNumber, imageUrl 
        FROM chapter_images 
        WHERE ChapterId = ?
        ORDER BY PageNumber ASC;
    `,
      [chapterId]
    );

    const mangaId = chapterInfoRows[0].mangaId;
    const [listChapterRows] = await db.query(
      `
        SELECT chapterId
        FROM chapters
        WHERE MangaId = ?
        ORDER BY 
          volumeNumber DESC,
          chapterNumber DESC
        ;
    `,
      [mangaId]
    );

    // console.log(listChapterRows);
    // console.log('length=', listChapterRows.length);
    const index = listChapterRows.findIndex(
      (chapter) => chapter.chapterId === chapterId
    );
    // console.log('curr index=', index);

    const prev_index = index + 1 >= listChapterRows.length ? null : index + 1;
    const next_index = index - 1 < 0 ? null : index - 1;
    // console.log('Next index=', next_index);
    // console.log('Prev index=', prev_index);

    const prev_chapterid =
      prev_index === null ? prev_index : listChapterRows[prev_index].chapterId;
    const next_chapterid =
      next_index === null ? next_index : listChapterRows[next_index].chapterId;
    // console.log('Next ChapterID=', next_chapterid);
    // console.log('Prev ChapterID=', prev_chapterid);

    await mangaService.updateMangaViews(mangaId);

    return {
      mangaId: mangaId,
      mangaName: chapterInfoRows[0].mangaName,
      isManga: chapterInfoRows[0].isManga,
      volumeNumber: chapterInfoRows[0].volumeNumber,
      chapterNumber: chapterInfoRows[0].chapterNumber,
      chapterName: chapterInfoRows[0].chapterName,
      previousChapterId: prev_chapterid,
      nextChapterId: next_chapterid,
      novelContext: chapterNovelRows[0].novelContext,
      chapterImages: chapterImageRows,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-images
module.exports.updateChapterImages = async (chapterId, chapterImages) => {
  try {
    const [rows] = await db.query(
      `DELETE FROM chapter_images WHERE ChapterId = ?`,
      [chapterId]
    );

    for (let i = 0; i < chapterImages.length; i++) {
      const [row] = await db.query(
        `
          INSERT INTO chapter_images(
              \`ChapterId\`,
              \`PageNumber\`,
              \`ImageUrl\`
          ) VALUES(?, ?, ?);
        `,
        [chapterId, chapterImages[i].pageNumber, chapterImages[i].imageUrl]
      );
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region delete-chapter
module.exports.deleteChapter = async (chapterId) => {
  try {
    const [row] = await db.query(
      `SELECT mangaId FROM chapters WHERE chapterId = ?`,
      [chapterId]
    );

    if (row.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    await db.query(`DELETE FROM chapters WHERE chapterId = ?`, [chapterId]);
    await mangaService.updateMangaNumChapter(row[0].mangaId);
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region check-manga-free-by-chapter-id
module.exports.checkMangaFreeByChapterId = async (chapterId) => {
  try {
    const [rows] = await db.query(
      `SELECT m.isFree, m.mangaId
      FROM chapters c
      JOIN mangas m
        ON c.mangaId = m.mangaId
      WHERE chapterId = ?`,
      [chapterId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
    return {
      mangaId: rows[0].mangaId,
      isFree: rows[0].isFree,
    };
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region get-manga-id-by-chapter-id
module.exports.getMangaIdByChapterId = async (chapterId) => {
  try {
    const [rows] = await db.query(
      `SELECT mangaId FROM chapters WHERE chapterId = ?`,
      [chapterId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
    return rows[0].mangaId;
  } catch (error) {
    throw error;
  }
};
//#endregion
