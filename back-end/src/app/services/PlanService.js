const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { formatISODate } = require("../../utilities/utils.js");

//#region have-user-bought
module.exports.isBoughtByUser = async (planId) => {
  try {
    const [rows] = await db.query(
      `SELECT planId FROM user_plans WHERE planId = ? and paymentStatus = 'completed'`,
      [planId]
    );

    return rows.length > 0;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-subscriptions
module.exports.getPlans = async (
  itemsPerPage = 5,
  pageNumber = 1,
  filter = HandleCode.FILTER_BY_UPDATE_DATE_DESC,
  keyword = ""
) => {
  try {
    const [totalRows] = await db.query(
      `SELECT COUNT(planId) as total
      FROM plans
      WHERE planName LIKE ?`,
      [`%${keyword}%`]
    );

    const total = totalRows[0].total;
    const totalPages = Math.ceil(total / itemsPerPage);

    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        subscriptions: [],
      };
    }

    let orderByClause;
    if (filter == HandleCode.FILTER_BY_UPDATE_DATE_DESC) {
      orderByClause = "UpdateAt DESC";
    } else if (filter == HandleCode.FILTER_BY_UPDATE_DATE_ASC) {
      orderByClause = "UpdateAt ASC";
    } else if (filter == HandleCode.FILTER_BY_CREATE_DATE_ASC) {
      orderByClause = "CreateAt ASC";
    } else if (filter == HandleCode.FILTER_BY_CREATE_DATE_DESC) {
      orderByClause = "CreateAt DESC";
    } else {
      orderByClause = "UpdateAt DESC";
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT planId, planName, price, duration, description, startAt, endAt, updateAt
      FROM plans
      WHERE planName LIKE ?
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?`,
      [`%${keyword}%`, itemsPerPage, offset]
    );

    const formatRows = rows.map((row) => ({
      ...row,
      startAt: formatISODate(row.startAt),
      endAt: row.endAt ? formatISODate(row.endAt) : null,
      updateAt: formatISODate(row.updateAt),
    }));

    return {
      pageNumber,
      totalPages,
      plans: formatRows,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.getPlanById = async (planId) => {
  try {
    const [infoRow] = await db.query(
      `SELECT planId, planName, price, duration, description, startAt, endAt, canReadAll
      FROM plans
      WHERE planId = ?`,
      [planId]
    );

    if (infoRow.length === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    const mangas = await db.query(
      `SELECT m.mangaId, m.mangaName, m.coverImageUrl
      FROM plan_mangas p
        INNER JOIN mangas m
      ON p.mangaId = m.mangaId
      WHERE p.planId = ?`,
      [planId]
    );

    const isBought = await this.isBoughtByUser(planId);

    return {
      planId: infoRow[0].planId,
      planName: infoRow[0].planName,
      price: infoRow[0].price,
      duration: infoRow[0].duration,
      description: infoRow[0].description,
      startAt: formatISODate(infoRow[0].startAt),
      endAt: infoRow[0].endAt ? formatISODate(infoRow[0].endAt) : null,
      canReadAll: infoRow[0].canReadAll,
      isBoughtByUser: isBought,
      mangas: mangas[0],
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-plan-by-manga-id
module.exports.getPlanByMangaId = async (mangaId) => {
  try {
    const [rows] = await db.query(
      ` SELECT p.planId, p.planName, p.duration, p.price, p.canReadAll, p.StartAt, p.EndAt
        FROM plans p
        LEFT JOIN plan_mangas pm ON p.PlanId = pm.PlanId
        WHERE (
            -- Check if the manga is included in the plan
            pm.MangaId = ? 
            OR p.canReadAll = 1
        )
        AND (
            -- Active plan: If endAt is null, consider the plan active forever; otherwise, check if current date is within the startAt and endAt range
            (p.EndAt IS NULL OR CURRENT_TIMESTAMP() BETWEEN p.StartAt AND p.EndAt)
            AND p.StartAt <= CURRENT_TIMESTAMP() -- Make sure the plan's start date has passed or is today
        );
        `,
      [mangaId]
    );

    return { plans: rows };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region add-subscription
module.exports.addPlanInfo = async (
  planName,
  price = 10000, // 10.000 VND
  duration = 31, // 31 days
  description = "",
  startAt,
  endAt,
  canReadAll = HandleCode.CANNOT_READ_ALL
) => {
  try {
    const [insertRow] = await db.query(
      `INSERT INTO plans (planName, price, duration, description, startAt, endAt, canReadAll) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [planName, price, duration, description, startAt, endAt, canReadAll]
    );

    const planId = insertRow.insertId;
    return {
      planId: planId,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-subscription
module.exports.updatePlanInfo = async (
  planId,
  planName,
  price = 10000, // 10.000 VND
  duration = 31, // 31 days
  description = "",
  startAt,
  endAt,
  canReadAll = HandleCode.CANNOT_READ_ALL
) => {
  try {
    // Check if the subscription is bought by any user
    const isBought = await module.exports.isBoughtByUser(planId);

    // If the subscription is bought, only update
    // planName, price, duration, description, endAt
    if (isBought) {
      const [rows] = await db.query(
        `UPDATE plans
        SET planName = ?, price = ?, duration = ?, description = ?, endAt = ?
        WHERE planId = ?`,
        [planName, price, duration, description, endAt, planId]
      );

      if (rows.affectedRows === 0) {
        return { code: HandleCode.NOT_FOUND };
      }

      return;
    }

    // If the subscription is not bought, allow full update
    const [rows] = await db.query(
      `UPDATE plans
      SET planName = ?, price = ?, duration = ?, description = ?, startAt = ?, endAt = ?, canReadAll = ?
      WHERE planId = ?`,
      [
        planName,
        price,
        duration,
        description,
        startAt,
        endAt,
        canReadAll,
        planId,
      ]
    );

    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }

    return;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region delete-subscription
module.exports.deletePlanbyId = async (planId) => {
  try {
    // Check if the subscription is bought by any user
    const isBought = await module.exports.isBoughtByUser(planId);

    if (isBought) {
      return { code: HandleCode.BOUGHT_BY_USER };
    }

    const [rows] = await db.query("DELETE FROM plans WHERE planId = ?", [
      planId,
    ]);
    if (rows.affectedRows === 0) {
      return { code: HandleCode.NOT_FOUND };
    }
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region update-subscription-chapter
module.exports.updatePlanMangas = async (planId, mangaIds) => {
  try {
    // Check if the plan is bought by any user
    const isBought = await module.exports.isBoughtByUser(planId);

    // If the plan is bought, return a specific code
    if (isBought) {
      return { code: HandleCode.BOUGHT_BY_USER };
    }

    // Remove all existing chapters for the plan
    await db.query("DELETE FROM plan_mangas WHERE planId = ?", [planId]);

    // Insert the new list of chapters
    for (let i = 0; i < mangaIds.length; i++) {
      await db.query(
        `INSERT INTO plan_mangas (PlanId, MangaId) VALUES (?, ?)`,
        [planId, mangaIds[i]]
      );
    }

    await db.query(
      "UPDATE plans SET updateAt = CURRENT_TIMESTAMP() WHERE planId = ?",
      [planId]
    );
    return;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region check-user-bought-manga
module.exports.checkUserBoughtManga = async (userId, mangaId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          COUNT(userPlanId) AS total
      FROM 
          user_plans up
      JOIN 
          plans p ON up.PlanId = p.PlanId
      LEFT JOIN 
          plan_mangas pm ON p.PlanId = pm.PlanId
      WHERE 
          up.UserId = ?              -- Replace with the user's ID
          AND (
              p.canReadAll = 1       -- If the plan allows all mangas
              OR pm.MangaId = ?      -- Or if the manga is explicitly in the plan
          )
          AND up.PaymentStatus = 'completed' -- Only consider plans with completed payment
          AND CURRENT_TIMESTAMP() BETWEEN up.StartAt AND up.EndAt; -- Ensure the plan is active
      `,
      [userId, mangaId]
    );
    return rows[0].total > 0;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region check-user-can-bought-plan
module.exports.checkUserCanBoughtPlan = async (userId, planId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          COUNT(userPlanId) AS total
      FROM 
          user_plans up
      WHERE 
          up.UserId = ?              -- Replace with the user's ID
          AND up.PlanId = ?          -- Replace with the plan's ID
          AND up.PaymentStatus = 'completed' -- Only consider plans with completed payment
          AND CURRENT_TIMESTAMP() BETWEEN up.StartAt AND up.EndAt; -- Ensure the plan is active
      `,
      [userId, planId]
    );
    return rows[0].total < 1;
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region user-buy-plan
module.exports.addUserPlan = async (userId, planId, price) => {
  try {
    const [row] = await db.query(
      `INSERT INTO user_plans (UserId, PlanId, Price) VALUES (?, ?, ?)`,
      [userId, planId, price]
    );

    const insertId = row.insertId;

    return {
      userPlanId: insertId,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region get-purchase-history
module.exports.getPurchaseHistoryByUserId = async (
  itemsPerPage = 5,
  pageNumber = 1,
  userId
) => {
  try {
    const [totalRows] = await db.query(
      `SELECT 
          COUNT(up.userPlanId) AS total
      FROM 
          user_plans up
      JOIN 
          plans p ON up.PlanId = p.PlanId
      WHERE 
          up.UserId = ?              -- Replace with the user's ID
          AND up.PaymentStatus = 'completed' -- Only consider plans with completed payment
      `,
      [userId]
    );

    const total = totalRows[0].total;
    const totalPages = Math.ceil(total / itemsPerPage);

    if (pageNumber > totalPages) {
      return {
        pageNumber,
        totalPages,
        plans: [],
      };
    }

    const offset = (pageNumber - 1) * itemsPerPage;
    const [rows] = await db.query(
      `SELECT 
          up.userPlanId, up.planId, p.planName, up.price, up.startAt, up.endAt,
          CASE 
              WHEN CURRENT_TIMESTAMP() BETWEEN up.startAt AND up.endAt THEN 'active'
              ELSE 'expired'
          END AS planStatus
      FROM 
          user_plans up
      JOIN 
          plans p ON up.PlanId = p.PlanId
      WHERE 
          up.UserId = ?
          AND up.PaymentStatus = 'completed'
      ORDER BY up.startAt DESC
      LIMIT ? OFFSET ?`,
      [userId, itemsPerPage, offset]
    );

    const formattedRows = rows.map((row) => ({
      ...row,
      startAt: formatISODate(row.startAt),
      endAt: formatISODate(row.endAt),
    }));

    return {
      pageNumber,
      totalPages,
      plans: formattedRows,
    };
  } catch (err) {
    throw err;
  }
};
//#endregion
