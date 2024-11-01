const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");

module.exports.getListManga = async (
  pageNumber = 1,
  itemsPerPage = 5,
  filter = HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC
) => {
  try {
    const [totalRows] = await db.query(
      "SELECT COUNT(MangaId) as total FROM mangas"
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

    let orderByClause, filterColName;
    switch (filter) {
      case HandleCode.FILTER_BY_MANGA_NAME_ASC:
        filterColName = "mangaName";
        orderByClause = "mangaName ASC";
        break;
      case HandleCode.FILTER_BY_MANGA_NAME_DESC:
        filterColName = "mangaName";
        orderByClause = "mangaName DESC";
        break;
      case HandleCode.FILTER_BY_MANGA_VIEW_ASC:
        filterColName = "NumViews";
        orderByClause = "NumViews ASC";
        break;
      case HandleCode.FILTER_BY_MANGA_VIEW_DESC:
        filterColName = "NumViews";
        orderByClause = "NumViews DESC";
        break;
      case HandleCode.FILTER_BY_MANGA_LIKE_ASC:
        filterColName = "NumLikes";
        orderByClause = "NumLikes ASC";
        break;
        case HandleCode.FILTER_BY_MANGA_LIKE_DESC:
        filterColName = "NumLikes";
        orderByClause = "NumLikes DESC";
        break;
      case HandleCode.FILTER_BY_MANGA_CREATE_DATE_ASC:
        filterColName = "CreateDate";
        orderByClause = "CreateDate ASC";
        break;
      case HandleCode.FILTER_BY_MANGA_CREATE_DATE_DESC:
        filterColName = "CreateDate";
        orderByClause = "CreateDate DESC";
        break;
        case HandleCode.FILTER_BY_MANGA_UPDATE_DATE_ASC:
        filterColName = "UpdateDate";
        orderByClause = "UpdateDate ASC";
        break;
      case HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC:
        default:
          filterColName = "UpdateDate";
          orderByClause = "UpdateDate DESC";
          break;
        }
        
    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT mangaId, mangaName, coverImageUrl, newestChapterNumber, ${filterColName}
        FROM mangas 
        ORDER BY ${orderByClause} 
        LIMIT ? OFFSET ?`,
      [itemsPerPage, offset]
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

module.exports.getMangaById = async (mangaId) => {
  try {
    const [rows] = await db.query(
      `SELECT mangaId, mangaName, otherName, coverImageUrl, 
              publishedYear, description, ageLimit, isManga, 
              numChapters, numViews, numLikes, numFollows,
              createDate, m.updateDate, m.authorId, a.authorName
      FROM mangas m
        JOIN authors a ON m.authorId = a.authorId
      WHERE mangaId = ?`,
      [mangaId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    return { authorInfo: rows[0] };
  } catch (err) {
    throw err;
  }
};

module.exports.addManga = async (
  mangaName, otherName, coverImageUrl,
  publishedYear, description, ageLimit,
  isManga=true, authorId=null
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
    fields.push("isManga");
    placeholders.push("?");
    values.push(isManga === true ? 1 : 0);

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
    const query = `INSERT INTO mangas (${fields.join(", ")}) VALUES (${placeholders.join(", ")})`;
    const [rows] = await db.query(query, values);

    return {
      mangaId: rows.insertId,
    }
  } catch (err) {
    throw err;
  }
};

module.exports.updateMangaInfo = async (
  mangaId,
  mangaName,
  otherName,
  coverImageUrl,
  publishedYear,
  description,
  ageLimit,
  isManga,
  authorId
) => {
  try {
    const fields = [];
    const values = [];

    if (mangaName && mangaName.trim().length > 0) {
      fields.push("mangaName = ?");
      values.push(mangaName);
    }
    if (otherName && otherName.trim().length > 0) {
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
      isManga = isManga ? 1 : 0;
      fields.push("isManga = ?");
      values.push(isManga);
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

module.exports.updateMangaNewChapter = async (
  mangaId,
  newChapterNumber,
  numChapters
) => {
  try {
    const [rows] = await db.query(
      `UPDATE mangas SET numChapters = ?, newestChapterNumber = ?, updateDate = CURRENT_TIMESTAMP() WHERE mangaId = ?`,
      [numChapters, newChapterNumber, mangaId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};

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

module.exports.updateMangaGenres = async (mangaId, genreIds) => {
  try {
    if (genreIds && genreIds.length > 0) {
      for (const genreId of genreIds) {
        await db.query(
          `INSERT INTO mangagenres(MangaId, GenreId) VALUES (?, ?)`,
          [mangaId, genreId]
        );
      }
    }
  } catch (err) {
    throw err;
  }
};

module.exports.getListMangaByGenreId = async (genreId, pageNumber=1, itemsPerPage=5) => {
  try {
    const [totalRows] = await db.query(
        `SELECT COUNT(MangaId) as total 
        FROM mangagenres
        WHERE GenreId= ?;`
        , [genreId]
    );
    const totalMangas = totalRows[0].total;
    const totalPages = Math.ceil(totalMangas / itemsPerPage);
    if (pageNumber > totalPages) {
        return { 
            pageNumber,
            totalPages, 
            mangas: []
        };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
        `SELECT m.mangaId, m.mangaName, m.coverImageUrl, m.newestChapterNumber
        FROM mangagenres mg
            JOIN (SELECT mangaId, mangaName, coverImageUrl, newestChapterNumber FROM mangas) as m ON mg.mangaId = m.mangaId
        WHERE genreId = ?
        LIMIT ? OFFSET ?;`,
        [genreId, itemsPerPage, offset]
    );

    return {
      pageNumber,
      totalPages,
      mangas: rows
    };
  } catch (err) {
    throw err;
  }
}

module.exports.getListMangaByAuthorId = async (authorId, pageNumber=1, itemsPerPage=5) => {
  try {
    const [totalRows] = await db.query(
        `SELECT COUNT(MangaId) as total 
        FROM mangas
        WHERE authorId= ?;`
        , [authorId]
    );
    const totalMangas = totalRows[0].total;
    const totalPages = Math.ceil(totalMangas / itemsPerPage);
    if (pageNumber > totalPages) {
      return { 
        pageNumber,
        totalPages, 
        mangas: []
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
        `SELECT m.mangaId, m.coverImageUrl, m.mangaName, m.newestChapterNumber
        FROM mangas m
        WHERE authorId = ?
        LIMIT ? OFFSET ?;`,
        [authorId, itemsPerPage, offset]
    );

    return {
      pageNumber,
      totalPages,
      mangas: rows
    };
  } catch (err) {
    throw err;
  }
}