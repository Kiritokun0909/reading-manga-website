const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");

//#region count-active-user
module.exports.getTotalActiveUser = async () => {
  try {
    const [row] = await db.query(
      `SELECT COUNT(userId) as count 
       FROM users
       WHERE status = 'active' and roleId = 2
      `
    );

    return { totalActiveUser: row[0].count || 0 };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region count-manga
module.exports.getTotalManga = async () => {
  try {
    const [row] = await db.query(
      `SELECT COUNT(mangaId) as total 
       FROM mangas
      `
    );

    return { totalManga: row[0].total || 0 };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region count-active-plan
module.exports.getTotalActivePlan = async () => {
  try {
    const [row] = await db.query(
      `SELECT COUNT(planId) AS count
       FROM plans
       WHERE startAt <= NOW()
          AND (endAt IS NULL OR endAt > NOW());
      `
    );

    return { totalActivePlan: row[0].count || 0 };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-revenue-from-to
module.exports.getRevenueFromTo = async (startDate, endDate) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          DATE(StartAt) AS revenueDate, 
          COALESCE(SUM(Price), 0) AS totalRevenue
       FROM 
          user_plans
       WHERE 
          PaymentStatus = 'completed' 
          AND StartAt BETWEEN ? AND ?
       GROUP BY 
          DATE(StartAt)
       ORDER BY 
          revenueDate`,
      [startDate, endDate]
    );

    // Convert rows into the desired object format
    const dailyRevenue = rows.reduce((result, row) => {
      const date = new Date(row.revenueDate);

      // Format the date as YYYY-MM-DD for Vietnam timezone
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      result[formattedDate] = row.totalRevenue;
      return result;
    }, {});

    return dailyRevenue;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-top-plans
module.exports.getTopPlans = async (month, year) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          p.planName, 
          COUNT(up.userPlanId) AS purchaseCount
      FROM 
          plans p
      LEFT JOIN 
          user_plans up 
          ON p.planId = up.planId
      WHERE
          up.paymentStatus = 'completed'
          AND MONTH(up.startAt) = ? 
          AND YEAR(up.startAt) = ?
      GROUP BY 
          p.planId, p.planName
      ORDER BY 
          purchaseCount DESC
      LIMIT 5;
      `,
      [month, year]
    );

    // Convert rows to desired JSON structure
    const result = rows.reduce((acc, row) => {
      acc[row.planName] = row.purchaseCount;
      return acc;
    }, {});

    return result;
  } catch (error) {
    throw error;
  }
};
