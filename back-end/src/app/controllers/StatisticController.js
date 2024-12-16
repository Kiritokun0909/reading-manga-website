const statisticService = require("../services/StatisticService");

class StatisticController {
  async getRevenueFromTo(req, res) {
    const { startDate, endDate } = req.query;
    try {
      const dailyRevenue = await statisticService.getRevenueFromTo(
        startDate,
        endDate
      );

      res.status(200).json(dailyRevenue);
    } catch (err) {
      console.log("Failed to get daily revenue:", err);
      res.status(500).json({
        message: "Failed to get daily revenue. Please try again later",
      });
    }
  }

  async getTotalActiveUser(req, res) {
    try {
      const totalActiveUser = await statisticService.getTotalActiveUser();
      res.status(200).json(totalActiveUser);
    } catch (err) {
      console.log("Failed to get total active user:", err);
      res.status(500).json({
        message: "Failed to get total active user. Please try again later",
      });
    }
  }

  async getTotalManga(req, res) {
    try {
      const totalManga = await statisticService.getTotalManga();
      res.status(200).json(totalManga);
    } catch (err) {
      console.log("Failed to get total manga:", err);
      res.status(500).json({
        message: "Failed to get total manga. Please try again later",
      });
    }
  }

  async getTotalActivePlan(req, res) {
    try {
      const totalActivePlan = await statisticService.getTotalActivePlan();
      res.status(200).json(totalActivePlan);
    } catch (err) {
      console.log("Failed to get total active plan:", err);
      res.status(500).json({
        message: "Failed to get total active plan. Please try again later",
      });
    }
  }

  async getTopPlans(req, res) {
    const { month, year } = req.query;
    try {
      const topPlans = await statisticService.getTopPlans(
        parseInt(month),
        parseInt(year)
      );
      res.status(200).json(topPlans);
    } catch (err) {
      console.log("Failed to get top plans:", err);
      res.status(500).json({
        message: "Failed to get top plans. Please try again later",
      });
    }
  }

  async getRevenueDetail(req, res) {
    const { pageNumber, itemsPerPage, keyword } = req.query;
    try {
      const result = await statisticService.getRevenueDetail(
        parseInt(pageNumber),
        parseInt(itemsPerPage),
        keyword
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get revenue detail:", err);
      res.status(500).json({
        message: "Failed to get revenue detail. Please try again later",
      });
    }
  }

  async getRevenueByPlan(req, res) {
    const { startDate, endDate, planId } = req.query;
    try {
      const result = await statisticService.getRevenueFromToByPlanId(
        planId,
        startDate,
        endDate
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get revenue by plan:", err);
      res.status(500).json({
        message: "Failed to get revenue by plan. Please try again later",
      });
    }
  }
}

module.exports = new StatisticController();
