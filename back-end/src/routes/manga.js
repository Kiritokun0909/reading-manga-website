// src/routes/manga.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const authService = require("../app/services/AuthService.js");
const mangaController = require("../app/controllers/MangaController.js");
const { verifyAccessToken, authorizeRole } = require("../middlewares/jwt.js");

router.get("/list", mangaController.getListManga);

router.get("/genre/:genreId", mangaController.getListMangaByGenre);

router.get("/author/:authorId", mangaController.getListMangaByAuthor);

router.post(
  "/",
  upload.single("coverImage"),
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  mangaController.addManga
);

router.put(
  "/update-genres/:mangaId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  mangaController.updateMangaGenres
);

router.get("/:mangaId", mangaController.getMangaInfo);

router.put(
  "/:mangaId",
  upload.single("coverImage"),
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  mangaController.updateMangaInfo
);

router.delete(
  "/:mangaId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  mangaController.removeManga
);

router.get("/reviews/:mangaId", mangaController.getMangaReview);

module.exports = router;
