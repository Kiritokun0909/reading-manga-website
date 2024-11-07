//src/routes/genre.js
const express = require("express");
const router = express.Router();

const authService = require("../app/services/AuthService.js");
const genreController = require("../app/controllers/GenreController.js");
const { verifyAccessToken, authorizeRole } = require("../middlewares/jwt.js");

router.get("/list", genreController.getListGenre);

router.post(
  "/",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  genreController.addGenre
);

router.put(
  "/:genreId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  genreController.updateGenre
);

router.delete(
  "/:genreId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  genreController.removeGenre
);

module.exports = router;
