const express = require("express");
const router = express.Router();

const PlanController = require("../app/controllers/PlanController.js");
const authService = require("../app/services/AuthService.js");
const { verifyAccessToken, authorizeRole } = require("../middlewares/jwt.js");

router.get("/list", PlanController.getPlans);

router.get("/:planId", PlanController.getPlanById);

router.post(
  "/",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  PlanController.addPlan
);

router.put(
  "/:planId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  PlanController.updatePlan
);

router.delete(
  "/:planId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  PlanController.deletePlan
);

module.exports = router;
