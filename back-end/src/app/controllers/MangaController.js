// src/app/controllers/AuthorController.js
const mangaService = require("../services/MangaService.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { uploadFile } = require("../../utilities/UploadFile.js");

class AuthorController {
  //#region get-list-manga
  async getListManga(req, res) {
    const { pageNumber, itemsPerPage, filter, keyword } = req.query;
    try {
      const result = await mangaService.getListManga(
        parseInt(pageNumber),
        parseInt(itemsPerPage),
        filter,
        keyword
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get list mangas:", err);
      res.status(500).json({
        message: "Failed to get list mangas. Please try again later.",
      });
    }
  }
  //#endregion

  async getListMangaByGenre(req, res) {
    const { genreId } = req.params;
    const { pageNumber, itemsPerPage } = req.query;
    try {
      const result = await mangaService.getListMangaByGenreId(
        parseInt(pageNumber),
        parseInt(itemsPerPage),
        genreId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get list manga by genre:", err);
      res.status(500).json({
        message: "Failed to get list manga by genre. Please try again later.",
      });
    }
  }

  async getListMangaByAuthor(req, res) {
    const { authorId } = req.params;
    const { pageNumber, itemsPerPage } = req.query;
    try {
      const result = await mangaService.getListMangaByAuthorId(
        parseInt(pageNumber),
        parseInt(itemsPerPage),
        authorId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get list manga by author:", err);
      res.status(500).json({
        message: "Failed to get list manga by author. Please try again later.",
      });
    }
  }

  //#region get-by-id
  async getMangaInfo(req, res) {
    const { mangaId } = req.params;
    try {
      const result = await mangaService.getMangaById(mangaId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "Manga not found." });
        return;
      }

      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get manga info:", err);
      res
        .status(500)
        .json({ message: "Failed to get manga info. Please try again later." });
    }
  }
  //#endregion

  //#region get-manga-review
  async getMangaReview(req, res) {
    const { mangaId } = req.params;
    const { pageNumber, itemsPerPage } = req.query;
    try {
      const result = await mangaService.getReviewsByMangaId(
        parseInt(itemsPerPage),
        parseInt(pageNumber),
        mangaId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get manga review:", err);
      res.status(500).json({
        message: "Failed to get manga review. Please try again later.",
      });
    }
  }
  //#endregion

  //#region add-manga
  async addManga(req, res) {
    const {
      mangaName,
      otherName,
      publishedYear,
      description,
      ageLimit,
      isManga,
      isFree,
      authorId,
    } = req.body;
    try {
      let coverImageUrl = "";
      if (req.file) {
        coverImageUrl = await uploadFile(
          req.file,
          HandleCode.FB_COVER_IMAGE_FOLDER_PATH
        );
      }
      const result = await mangaService.addManga(
        coverImageUrl,
        mangaName,
        otherName,
        isManga,
        isFree,
        publishedYear,
        ageLimit,
        description,
        authorId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to add manga:", err);
      res
        .status(500)
        .json({ message: "Failed to add manga. Please try again later." });
    }
  }
  //#endregion

  //#region update-manga
  async updateMangaInfo(req, res) {
    const { mangaId } = req.params;
    const {
      mangaName,
      otherName,
      publishedYear,
      description,
      ageLimit,
      isManga,
      isFree,
      authorId,
    } = req.body;
    try {
      let coverImageUrl = "";
      if (req.file) {
        coverImageUrl = await uploadFile(
          req.file,
          HandleCode.FB_COVER_IMAGE_FOLDER_PATH
        );
      }
      const result = await mangaService.updateMangaInfo(
        mangaId,
        mangaName,
        otherName,
        coverImageUrl,
        publishedYear,
        description,
        ageLimit,
        isManga,
        isFree,
        authorId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to update manga info:", err);
      res.status(500).json({
        message: "Failed to update manga info. Please try again later.",
      });
    }
  }
  //#endregion

  //#region update-manga-genre
  async updateMangaGenres(req, res) {
    const { mangaId } = req.params;
    const { genreIds } = req.body;
    try {
      const result = await mangaService.updateMangaGenres(mangaId, genreIds);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to update manga genres:", err);
      res.status(500).json({
        message: "Failed to update manga genres. Please try again later.",
      });
    }
  }
  //#endregion

  //#region remove-manga
  async removeManga(req, res) {
    const { mangaId } = req.params;
    try {
      const result = await mangaService.removeManga(mangaId);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to remove manga:", err);
      res
        .status(500)
        .json({ message: "Failed to remove manga. Please try again later." });
    }
  }
  //#endregion
}

module.exports = new AuthorController();
