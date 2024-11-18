const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { formatISODate } = require("../../utilities/utils.js");

//#region notify-new-chapter
module.exports.notifyNewChapter = async (mangaId) => {
  try {
    const [userRows] = await db.query(
      `SELECT userId FROM following WHERE mangaId = ?`,
      [mangaId]
    );

    for (let i = 0; i < userRows.length; i++) {
      await this.addNotification(
        userRows[i].userId,
        "New chapter released",
        mangaId
      );
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region add-notification
module.exports.addNotification = async (userId, message, mangaId = 0) => {
  try {
    const [rows] = await db.query(
      "INSERT INTO notifications (userId, message, mangaId) VALUES (?, ?, ?)",
      [userId, message, mangaId]
    );
    return rows;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region count-unread-notification
module.exports.countUnreadNotification = async (userId) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(notificationId) as total FROM notifications WHERE userId = ? AND isRead = 0",
      [userId]
    );
    return rows[0].total;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-notifications
module.exports.getNotifications = async (
  itemsPerPage = 5,
  pageNumber = 1,
  userId
) => {
  try {
    const [totalRows] = await db.query(
      "SELECT COUNT(notificationId) as total FROM notifications WHERE userId = ?",
      [userId]
    );

    const total = totalRows[0].total;
    const totalPages = Math.ceil(total / itemsPerPage);
    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        notifications: [],
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT notificationId, message, isRead, n.createAt, n.mangaId, m.mangaName, m.newestChapterNumber
      FROM notifications n
      LEFT JOIN mangas m ON n.mangaId = m.mangaId
      WHERE userId = ?
      ORDER BY n.createAt DESC
      LIMIT ? OFFSET ?`,
      [userId, itemsPerPage, offset]
    );

    const formattedRows = rows.map((row) => ({
      ...row,
      createAt: formatISODate(row.createAt),
    }));

    return {
      pageNumber,
      totalPages,
      notifications: formattedRows,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-notification
module.exports.readNotification = async (notificationId) => {
  try {
    const [rows] = await db.query(
      "UPDATE notifications SET isRead = 1 WHERE notificationId = ?",
      [notificationId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion
