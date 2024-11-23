const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");

//#region get-reviews-by-manga
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

//#region set-review-status
module.exports.setReviewStatus = async (
  reviewId,
  status = HandleCode.REVIEW_IS_HIDE
) => {
  try {
    const [rows] = await db.query(
      "UPDATE reviews SET isHide = ? WHERE reviewId = ?",
      [status, reviewId]
    );
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion
