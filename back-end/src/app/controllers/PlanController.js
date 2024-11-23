// src/app/controllers/PlanController.js

const PlanService = require("../services/PlanService.js");
const HandleCode = require("../../utilities/HandleCode.js");

class PlanController {
  //#region get-subscriptions
  async getPlans(req, res) {
    const { itemsPerPage, pageNumber, filter, keyword } = req.query;
    try {
      const result = await PlanService.getPlans(
        parseInt(itemsPerPage),
        parseInt(pageNumber),
        filter,
        keyword
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get plans:", err);
      res.status(500).json({
        message: "Failed to get plans. Please try again later",
      });
    }
  }
  //#endregion

  //#region get-subscription-by-id
  async getPlanById(req, res) {
    const { planId } = req.params;
    try {
      const result = await PlanService.getPlanById(planId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "Plan not found" });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get plan by id:", err);
      res.status(500).json({
        message: "Failed to get plan by id. Please try again later",
      });
    }
  }
  //#endregion

  //#region add-subscription
  async addPlan(req, res) {
    const {
      planName,
      price,
      duration,
      description,
      startAt,
      endAt,
      canReadAll,
      mangaIds,
    } = req.body;
    try {
      const result = await PlanService.addPlanInfo(
        planName,
        price,
        duration,
        description,
        startAt,
        endAt,
        canReadAll
      );

      await PlanService.updatePlanMangas(result.planId, mangaIds);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to add subscription:", err);
      res.status(500).json({
        message: "Failed to add subscription. Please try again later",
      });
    }
  }
  //#endregion

  //#region update-subscription
  async updatePlan(req, res) {
    const { planId } = req.params;
    const {
      planName,
      price,
      duration,
      description,
      startAt,
      endAt,
      canReadAll,
      mangaIds,
    } = req.body;
    try {
      const result = await PlanService.updatePlanInfo(
        planId,
        planName,
        price,
        duration,
        description,
        startAt,
        endAt,
        canReadAll
      );

      await PlanService.updatePlanMangas(planId, mangaIds);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to update plan:", err);
      res.status(500).json({
        message: "Failed to update plan. Please try again later",
      });
    }
  }
  //#endregion

  //#region delete-plan
  async deletePlan(req, res) {
    const { planId } = req.params;
    try {
      const result = await PlanService.deletePlanbyId(planId);
      if (result && result.code == HandleCode.BOUGHT_BY_USER) {
        res.status(405).json({
          message: "Cannot delete plan because having user bought it.",
        });
        return;
      }

      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to delete plan:", err);
      res.status(500).json({
        message: "Failed to delete plan. Please try again later",
      });
    }
  }
}

module.exports = new PlanController();
