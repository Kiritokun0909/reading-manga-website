const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { formatISODate } = require("../../utilities/utils.js");

//#region have-user-bought
module.exports.isBoughtByUser = async (planId) => {
  try {
    const [rows] = await db.query(
      `SELECT planId FROM user_plans WHERE planId = ?`,
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
  filter = HandleCode.FILTER_BY_SUBS_UPDATE_DATE_DESC,
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
      `SELECT planId, planName, price, duration, description, startAt, endAt
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

    return {
      planId: infoRow[0].planId,
      planName: infoRow[0].planName,
      price: infoRow[0].price,
      duration: infoRow[0].duration,
      description: infoRow[0].description,
      startAt: formatISODate(infoRow[0].startAt),
      endAt: infoRow[0].endAt ? formatISODate(infoRow[0].endAt) : null,
      canReadAll: infoRow[0].canReadAll,
      mangas: mangas[0],
    };
  } catch (err) {
    throw err;
  }
};
//#endregion

//#region add-subscription
module.exports.addPlanInfo = async (
  planName,
  price = 10000 * 1000, // 10.000 VND * 1000
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

//region update-subscription
module.exports.updatePlanInfo = async (
  planId,
  planName,
  price = 10000 * 1000, // 10.000 VND * 1000
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
        SET planName, price, duration, description, endAt = ?
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

//region delete-subscription
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

//region update-subscription-chapter
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

    return;
  } catch (err) {
    throw err;
  }
};
//#endregion
