// src/routes/manga.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const authService = require("../app/services/AuthService.js");
const chapterController = require("../app/controllers/ChapterController.js");
const { verifyAccessToken, authorizeRole } = require("../middlewares/jwt.js");

router.get("/list/:mangaId", chapterController.getListChapter);

router.get("/:chapterId", chapterController.getChapterById);

// router.get("/author/:authorId", mangaController.getListMangaByAuthor);

router.post(
  "/:mangaId",
  upload.array("chapterImages"),
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  chapterController.addChapter
);

router.put(
  "/:chapterId",
  upload.array("chapterImages"),
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  chapterController.updateChapter
);

// router.get("/:mangaId", mangaController.getMangaInfo);

// router.put(
//   "/:mangaId",
//   upload.single("coverImage"),
//   verifyAccessToken,
//   authorizeRole([authService.RoleEnum.ADMIN]),
//   mangaController.updateMangaInfo
// );

router.delete(
  "/:chapterId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.ADMIN]),
  chapterController.removeChapter
);

module.exports = router;
