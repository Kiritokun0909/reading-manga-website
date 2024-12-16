const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { formatISODate } = require("../../utilities/utils.js");

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

    const result = rows.reduce((acc, row) => {
      acc[row.planName] = row.purchaseCount;
      return acc;
    }, {});

    return result;
  } catch (error) {
    throw error;
  }
};

//#endregion

//#region get-revenue-detail
module.exports.getRevenueDetail = async (
  pageNumber = 1,
  itemsPerPage = 5,
  keyword
) => {
  try {
    const [totalRows] = await db.query(
      `SELECT 
          COUNT(up.userPlanId) as total
      FROM 
          (SELECT userPlanId, userId, planId FROM user_plans where paymentStatus = 'completed') up
          JOIN users u ON u.userId = up.userId
          JOIN plans p ON p.planId = up.planId
      WHERE 
          u.username LIKE ? OR u.email LIKE ?;
      `,
      [`%${keyword}%`, `%${keyword}%`]
    );

    const totalPlans = totalRows[0].total;
    const totalPages = Math.ceil(totalPlans / itemsPerPage);

    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        revenues: [],
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT 
          up.UserPlanId, p.planName, u.email, u.username, up.price, up.startAt, up.endAt
      FROM 
          (SELECT userPlanId, userId, planId, price, startAt, endAt FROM user_plans where paymentStatus = 'completed') up
          JOIN users u ON u.userId = up.userId
          JOIN plans p ON p.planId = up.planId
      WHERE 
          u.username LIKE ? OR u.email LIKE ?
      ORDER BY 
          startAt DESC
      LIMIT ? OFFSET ?;
      `,
      [`%${keyword}%`, `%${keyword}%`, itemsPerPage, offset]
    );

    const formattedRows = rows.map((row) => ({
      ...row,
      startAt: formatISODate(row.startAt),
      endAt: formatISODate(row.endAt),
    }));

    return {
      pageNumber,
      totalPages,
      revenues: formattedRows,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-revenue-by-plan-from-to
module.exports.getRevenueFromToByPlanId = async (
  planId,
  startDate,
  endDate
) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          DATE(startAt) AS revenueDate, 
          COALESCE(SUM(price), 0) AS totalRevenue
       FROM 
          user_plans
       WHERE 
          planId = ?
          AND paymentStatus = 'completed' 
          AND startAt BETWEEN ? AND ?
       GROUP BY 
          DATE(StartAt)
       ORDER BY 
          revenueDate`,
      [planId, startDate, endDate]
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
