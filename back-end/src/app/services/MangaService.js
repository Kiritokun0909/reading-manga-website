const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { formatISODate } = require("../../utilities/utils.js");
const notificationService = require("./NotificationService.js");

//#region get-list-manga
module.exports.getListManga = async (
  pageNumber = 1,
  itemsPerPage = 5,
  filter = HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC,
  keyword = ""
) => {
  try {
    let filterHideManga =
      filter == HandleCode.FILTER_HIDE_MANGA
        ? "AND isHide = 1"
        : "AND isHide = 0";

    const [totalRows] = await db.query(
      `SELECT 
          COUNT(MangaId) as total 
      FROM 
          mangas 
      WHERE
          (mangaName LIKE ? OR otherName LIKE ?) ${filterHideManga}`,
      [`%${keyword}%`, `%${keyword}%`]
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

    let orderByClause;
    if (filter == HandleCode.FILTER_BY_MANGA_CREATE_DATE_ASC) {
      orderByClause = "CreateAt ASC";
    } else if (filter == HandleCode.FILTER_BY_MANGA_CREATE_DATE_DESC) {
      orderByClause = "CreateAt DESC";
    } else if (filter == HandleCode.FILTER_BY_MANGA_VIEW_ASC) {
      orderByClause = "NumViews ASC";
    } else if (filter == HandleCode.FILTER_BY_MANGA_VIEW_DESC) {
      orderByClause = "NumViews DESC";
    } else if (filter == HandleCode.FILTER_BY_MANGA_LIKE_ASC) {
      orderByClause = "NumLikes ASC";
    } else if (filter == HandleCode.FILTER_BY_MANGA_LIKE_DESC) {
      orderByClause = "NumLikes DESC";
    } else if (filter == HandleCode.FILTER_BY_MANGA_UPDATE_DATE_ASC) {
      orderByClause = "UpdateAt ASC";
    } else {
      orderByClause = "UpdateAt DESC";
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT mangaId, mangaName, coverImageUrl, newestChapterNumber
        FROM mangas 
        WHERE
          (mangaName LIKE ? OR otherName LIKE ?) ${filterHideManga}
        ORDER BY ${orderByClause} 
        LIMIT ? OFFSET ?`,
      [`%${keyword}%`, `%${keyword}%`, itemsPerPage, offset]
    );

    return {
      pageNumber,
      totalPages,
      mangas: rows,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-by-genre
module.exports.getListMangaByGenreId = async (
  pageNumber = 1,
  itemsPerPage = 5,
  genreId
) => {
  try {
    let filterHideManga = "AND m.isHide = 0";

    const [totalRows] = await db.query(
      `SELECT COUNT(mg.MangaId) as total 
        FROM manga_genres mg
        JOIN (SELECT mangaId, isHide FROM mangas) as m ON mg.mangaId = m.mangaId
        WHERE GenreId= ? ${filterHideManga};`,
      [genreId]
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

    const [genreRow] = await db.query(
      `SELECT genreName FROM genres WHERE GenreId = ?;`,
      [genreId]
    );
    const genreName = genreRow[0].genreName;

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT m.mangaId, m.mangaName, m.coverImageUrl, m.newestChapterNumber
        FROM manga_genres mg
          JOIN (SELECT mangaId, mangaName, coverImageUrl, newestChapterNumber, isHide FROM mangas) as m ON mg.mangaId = m.mangaId
        WHERE genreId = ? ${filterHideManga}
        LIMIT ? OFFSET ?;`,
      [genreId, itemsPerPage, offset]
    );

    return {
      genreId,
      genreName,
      pageNumber,
      totalPages,
      mangas: rows,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-by-author
module.exports.getListMangaByAuthorId = async (
  pageNumber = 1,
  itemsPerPage = 5,
  authorId
) => {
  try {
    let filterHideManga = "AND isHide = 0";

    const [totalRows] = await db.query(
      `SELECT COUNT(MangaId) as total 
        FROM mangas
        WHERE authorId= ? ${filterHideManga};`,
      [authorId]
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

    const [authorRow] = await db.query(
      `SELECT authorName, avatar, biography FROM authors WHERE AuthorId = ?;`,
      [authorId]
    );
    const authorName = authorRow[0].authorName;
    const avatar = authorRow[0].avatar;
    const biography = authorRow[0].biography;

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT m.mangaId, m.coverImageUrl, m.mangaName, m.newestChapterNumber
        FROM mangas m
        WHERE authorId = ? ${filterHideManga}
        LIMIT ? OFFSET ?;`,
      [authorId, itemsPerPage, offset]
    );

    return {
      authorId,
      authorName,
      avatar,
      biography,
      pageNumber,
      totalPages,
      mangas: rows,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-by-id
module.exports.getMangaById = async (mangaId) => {
  try {
    const [rows] = await db.query(
      `SELECT m.mangaId, m.mangaName, m.otherName, m.coverImageUrl, 
              m.publishedYear, m.description, m.ageLimit, m.isManga, m.isFree,
              m.numChapters, m.numViews, m.numLikes, m.numFollows,
              m.createAt, m.updateAt, m.isHide, m.authorId, a.authorName
       FROM mangas m
       LEFT JOIN authors a ON m.authorId = a.authorId
       WHERE m.mangaId = ?`,
      [mangaId]
    );

    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    const [genreRows] = await db.query(
      `
      SELECT mg.genreId, g.genreName
      FROM manga_genres mg
      JOIN genres g ON mg.genreId = g.genreId
      WHERE mangaId = ?
    `,
      [mangaId]
    );

    const formatCreateAt = formatISODate(rows[0].createAt);
    const formatUpdateAt = formatISODate(rows[0].updateAt);

    // Formatting the date fields and handling null authorName if necessary
    const mangaInfo = {
      ...rows[0],
      createAt: formatCreateAt,
      updateAt: formatUpdateAt,
      isHide: rows[0].isHide == HandleCode.IS_HIDE,
      authorName: rows[0].authorName || "", // Default value if null
      genres: genreRows,
    };

    return { mangaInfo };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-reviews
module.exports.getReviewsByMangaId = async (
  itemsPerPage,
  pageNumber,
  mangaId
) => {
  try {
    const [totalRows] = await db.query(
      `SELECT COUNT(reviewId) as total 
        FROM reviews
        WHERE mangaId= ?;`,
      [mangaId]
    );
    const totalComments = totalRows[0].total;
    const totalPages = Math.ceil(totalComments / itemsPerPage);
    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        reviews: [],
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT r.reviewId, u.avatar, u.username, u.email, r.context, r.createAt, r.isHide
        FROM reviews r
          JOIN users u ON r.userId = u.userId
        WHERE mangaId = ?
        ORDER BY createAt DESC
        LIMIT ? OFFSET ?;`,
      [mangaId, itemsPerPage, offset]
    );

    const formattedReviews = rows.map((review) => ({
      ...review,
      context: review.isHide == HandleCode.REVIEW_IS_HIDE ? "" : review.context,
      createAt: formatISODate(review.createAt),
    }));

    return {
      pageNumber,
      totalPages,
      reviews: formattedReviews,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region add-manga
module.exports.addManga = async (
  coverImageUrl,
  mangaName,
  otherName = "",
  isManga = true,
  isFree = false,
  publishedYear,
  ageLimit,
  description = "",
  authorId = null
) => {
  try {
    const fields = [];
    const placeholders = [];
    const values = [];

    if (mangaName && mangaName.trim().length > 0) {
      fields.push("mangaName");
      placeholders.push("?");
      values.push(mangaName);
    }
    if (otherName && otherName.trim().length > 0) {
      fields.push("otherName");
      placeholders.push("?");
      values.push(otherName);
    }
    if (coverImageUrl && coverImageUrl.trim().length > 0) {
      fields.push("coverImageUrl");
      placeholders.push("?");
      values.push(coverImageUrl);
    }
    if (publishedYear && publishedYear.trim().length > 0) {
      fields.push("publishedYear");
      placeholders.push("?");
      values.push(publishedYear);
    }
    if (description && description.trim().length > 0) {
      fields.push("description");
      placeholders.push("?");
      values.push(description);
    }
    if (ageLimit && ageLimit.trim().length > 0) {
      fields.push("ageLimit");
      placeholders.push("?");
      values.push(ageLimit);
    }
    if (isManga) {
      fields.push("isManga");
      placeholders.push("?");
      values.push(isManga);
    }
    if (isFree) {
      fields.push("isFree");
      placeholders.push("?");
      values.push(isFree);
    }
    if (authorId && authorId.trim().length > 0) {
      fields.push("authorId");
      placeholders.push("?");
      values.push(authorId);
    }

    // Check if there are any fields to insert
    if (fields.length === 0) {
      return { code: HandleCode.NO_FIELDS_TO_UPDATE };
    }

    // Construct the dynamic SQL query
    const query = `INSERT INTO mangas (${fields.join(
      ", "
    )}) VALUES (${placeholders.join(", ")})`;
    const [rows] = await db.query(query, values);

    return {
      mangaId: rows.insertId,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-manga-info
module.exports.updateMangaInfo = async (
  mangaId,
  mangaName,
  otherName,
  coverImageUrl,
  publishedYear,
  description,
  ageLimit,
  isManga,
  isFree,
  authorId
) => {
  try {
    const fields = [];
    const values = [];

    if (mangaName && mangaName.trim().length > 0) {
      fields.push("mangaName = ?");
      values.push(mangaName);
    }
    if (otherName) {
      fields.push("otherName = ?");
      values.push(otherName);
    }
    if (coverImageUrl && coverImageUrl.trim().length > 0) {
      fields.push("coverImageUrl = ?");
      values.push(coverImageUrl);
    }
    if (publishedYear) {
      fields.push("publishedYear = ?");
      values.push(publishedYear);
    }
    if (description) {
      fields.push("description = ?");
      values.push(description);
    }
    if (ageLimit) {
      fields.push("ageLimit = ?");
      values.push(ageLimit);
    }
    if (isManga) {
      fields.push("isManga = ?");
      values.push(isManga);
    }
    if (isFree) {
      fields.push("isFree = ?");
      values.push(isFree);
    }
    if (authorId) {
      fields.push("authorId = ?");
      values.push(authorId);
    }

    if (fields.length === 0) {
      return { code: HandleCode.NO_FIELDS_TO_UPDATE };
    }

    values.push(mangaId);

    const query = `UPDATE mangas SET ${fields.join(", ")} WHERE mangaId = ?`;
    const [rows] = await db.query(query, values);

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-manga-genres
module.exports.updateMangaGenres = async (mangaId, genreIds) => {
  try {
    await db.query(`DELETE FROM manga_genres WHERE MangaId = ?`, [mangaId]);

    if (genreIds && genreIds.length > 0) {
      for (const genreId of genreIds) {
        await db.query(
          `INSERT INTO manga_genres(MangaId, GenreId) VALUES (?, ?)`,
          [mangaId, genreId]
        );
      }
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region remove-manga
module.exports.removeManga = async (mangaId) => {
  try {
    const [rows] = await db.query("DELETE FROM mangas WHERE mangaId = ?", [
      mangaId,
    ]);
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-manga-hide-status
module.exports.updateMangaHideStatus = async (mangaId, isHidden = true) => {
  const isHide = isHidden ? HandleCode.IS_HIDE : HandleCode.NOT_HIDE;
  try {
    const [rows] = await db.query(
      `UPDATE mangas SET isHide = ? WHERE mangaId = ?`,
      [isHide, mangaId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-num-chapter
module.exports.updateMangaNumChapter = async (mangaId) => {
  try {
    const [countRows] = await db.query(
      `SELECT COUNT(chapterId) as total FROM chapters WHERE mangaId = ?`,
      [mangaId]
    );
    const numChapters = countRows[0].total;

    const [rows] = await db.query(
      `UPDATE mangas SET numChapters = ?, updateAt = CURRENT_TIMESTAMP() WHERE mangaId = ?`,
      [numChapters, mangaId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-newest-chapter
module.exports.updateMangaNewChapterNumber = async (
  mangaId,
  newChapterNumber
) => {
  try {
    const [rows] = await db.query(
      `UPDATE mangas SET newestChapterNumber = ? WHERE mangaId = ?`,
      [newChapterNumber, mangaId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
    await this.updateMangaNumChapter(mangaId);
    await notificationService.notifyNewChapter(mangaId);
  } catch (err) {
    throw err;
  }
};
//#endregion

module.exports.updateMangaViews = async (mangaId) => {
  try {
    const [rows] = await db.query(
      "UPDATE mangas SET numViews = numViews + 1 WHERE mangaId = ?",
      [mangaId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};

module.exports.updateMangaLikes = async (mangaId, isLike = true) => {
  try {
    const [rows] = await db.query(
      "UPDATE mangas SET numLikes = numLikes + ? WHERE mangaId = ?",
      [isLike ? 1 : -1, mangaId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};

module.exports.updateMangaFollows = async (mangaId, isFollow = true) => {
  try {
    const [rows] = await db.query(
      "UPDATE mangas SET numFollows = numFollows + ? WHERE mangaId = ?",
      [isFollow ? 1 : -1, mangaId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
