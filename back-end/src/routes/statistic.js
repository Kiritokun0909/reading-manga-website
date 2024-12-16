const express = require("express");
const router = express.Router();

const statisticController = require("../app/controllers/StatisticController.js");

router.get("/active-user", statisticController.getTotalActiveUser);

router.get("/total-manga", statisticController.getTotalManga);

router.get("/active-plan", statisticController.getTotalActivePlan);

router.get("/revenue", statisticController.getRevenueFromTo);

router.get("/top-plan", statisticController.getTopPlans);

router.get("/revenue-detail", statisticController.getRevenueDetail);

router.get("/revenue-by-plan", statisticController.getRevenueByPlan);

module.exports = router;
