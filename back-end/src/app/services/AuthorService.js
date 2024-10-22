const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");

module.exports.getListAuthor = async (
  pageNumber = 1,
  itemsPerPage = 5,
  filter = HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_DESC
) => {
  try {
    const [totalRows] = await db.query(
      "SELECT COUNT(AuthorId) as total FROM authors"
    );
    const totalAuthors = totalRows[0].total;

    const totalPages = Math.ceil(totalAuthors / itemsPerPage);
    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        authors: [],
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;

    // Map filter value to corresponding SQL ORDER BY clause
    let orderByClause;
    switch (filter) {
      case HandleCode.FILTER_BY_AUTHOR_NAME_ASC:
        orderByClause = "authorName ASC";
        break;
      case HandleCode.FILTER_BY_AUTHOR_NAME_DESC:
        orderByClause = "authorName DESC";
        break;
      case HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_ASC:
        orderByClause = "UpdateDate ASC";
        break;
      case HandleCode.FILTER_BY_AUTHOR_UPDATE_DATE_DESC:
      default:
        orderByClause = "UpdateDate DESC";
        break;
    }

    const [rows] = await db.query(
      `SELECT authorId, avatar, authorName
        FROM authors 
        ORDER BY ${orderByClause} 
        LIMIT ? OFFSET ?`,
      [itemsPerPage, offset]
    );

    return {
      pageNumber,
      totalPages,
      authors: rows, // Fixed the typo from 'mangas' to 'authors'
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getAuthorInfo = async (authorId) => {
  try {
    const [rows] = await db.query(
      "SELECT authorId, avatar, authorName, biography, updateDate FROM authors WHERE authorId = ?",
      [authorId]
    );
    if (rows.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    return { authorInfo: rows[0] };
  } catch (err) {
    throw err;
  }
};

module.exports.addAuthor = async (avatar, authorName, biography) => {
  try {
    const [rows] = await db.query(
      "INSERT INTO authors (avatar, authorName, biography) VALUES (?, ?, ?)",
      [avatar, authorName, biography]
    );

  } catch (err) {
    throw err;
  }
};

module.exports.updateAuthor = async (authorId, avatar, authorName, biography) => {
  try {
    // Initialize an array to hold the fields to be updated
    const fields = [];
    const values = [];

    // Dynamically add fields that are not null or empty
    if (avatar && avatar.trim().length > 0) {
      fields.push("avatar = ?");
      values.push(avatar);
    }
    if (authorName && authorName.trim().length > 0) {
      fields.push("authorName = ?");
      values.push(authorName);
    }
    if (biography !== null) { // You might want to allow empty biography
      fields.push("biography = ?");
      values.push(biography);
    }

    // If there are no fields to update, return an appropriate response
    if (fields.length === 0) {
      return { code: HandleCode.NO_FIELDS_TO_UPDATE };
    }

    // Add authorId to the values array
    values.push(authorId);

    // Construct the dynamic query
    const query = `UPDATE authors SET ${fields.join(", ")} WHERE authorId = ?`;

    const [rows] = await db.query(query, values);

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

  } catch (err) {
    throw err;
  }
};


module.exports.removeAuthor = async (authorId) => {
  try {
    const [rows] = await db.query(
      "DELETE FROM authors WHERE authorId = ?",
      [authorId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

  } catch (err) {
    throw err;
  }
};