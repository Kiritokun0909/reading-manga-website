const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");

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
