// src/routes/manga.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const mangaController = require("../app/controllers/MangaController.js");

router.get("/list", mangaController.getListManga);

router.get("/genre/:genreId", mangaController.getListMangaByGenre);

router.get("/author/:authorId", mangaController.getListMangaByAuthor);

router.post("/", upload.single("coverImage"), mangaController.addManga);

router.put("/update-genres/:mangaId", mangaController.updateMangaGenres);

router.get("/:mangaId", mangaController.getMangaInfo);

router.put(
  "/:mangaId",
  upload.single("coverImage"),
  mangaController.updateMangaInfo
);

router.delete("/:mangaId", mangaController.removeManga);

module.exports = router;
