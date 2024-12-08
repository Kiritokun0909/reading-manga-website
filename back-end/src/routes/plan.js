const express = require("express");
const router = express.Router();

const PlanController = require("../app/controllers/PlanController.js");
const authService = require("../app/services/AuthService.js");
const { verifyAccessToken, authorizeRole } = require("../middlewares/jwt.js");

router.get("/list", PlanController.getPlans);

router.get("/list-by-manga/:mangaId", PlanController.getPlanByMangaId);

router.get(
  "/history",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.USER]),
  PlanController.getUserPlan
);

router.get(
  "/buy/:planId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.USER]),
  PlanController.buyPlan
);

router.get(
  "/check-user-bought-plan/:planId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.USER]),
  PlanController.checkUserBoughtPlan
);
router.get(
  "/check-user-bought-manga/:mangaId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.USER]),
  PlanController.checkUserBoughtManga
);

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
