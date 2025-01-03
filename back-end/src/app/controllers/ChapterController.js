// src/app/controllers/ChapterController.js
const chapterService = require("../services/ChapterService.js");
const planService = require("../services/PlanService.js");
const authService = require("../services/AuthService.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { uploadFile } = require("../../utilities/UploadFile.js");
const { response } = require("express");

class ChapterController {
  //#region get-list-chapter
  async getListChapter(req, res) {
    const mangaId = parseInt(req.params.mangaId, 10);
    try {
      const result = await chapterService.getListChapterByMangaId(mangaId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "Manga not found." });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.log("Failed to get list chapter:", error);
      res.status(500).json({ message: "Failed to get list chapter." });
    }
  }
  //#endregion

  //#region get-chapter-by-id
  async getChapterById(req, res) {
    const chapterId = parseInt(req.params.chapterId, 10);
    const userId = req.user?.id || null;
    try {
      const response = await chapterService.checkMangaFreeByChapterId(
        chapterId
      );
      const mangaId = response.mangaId;
      const isFree = response.isFree;
      if (isFree === HandleCode.MANGA_NOT_FREE) {
        if (!userId) {
          res.status(403).json({
            mangaId: mangaId,
            message: "Require user to login to read chapter.",
          });
          return;
        }

        const userRoleId = await authService.getUserRole(userId);
        if (userRoleId !== HandleCode.ROLE_ADMIN) {
          //Check user bought plan to read this manga
          const checkUserBoughtManga = await planService.checkUserBoughtManga(
            userId,
            mangaId
          );

          if (!checkUserBoughtManga) {
            res.status(403).json({
              mangaId: mangaId,
              message: "Require user to buy manga to read chapter.",
            });
            return;
          }
        }
      }

      const result = await chapterService.getChapter(chapterId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "Chapter not found." });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.log("Failed to get chapter by id:", error);
      res.status(500).json({ message: "Failed to get chapter by id." });
    }
  }
  //#endregion

  //#region add-chapter
  async addChapter(req, res) {
    const mangaId = parseInt(req.params.mangaId, 10);
    const { volumeNumber, chapterNumber, chapterName, novelContext } = req.body;

    try {
      let result = await chapterService.addChapter(
        mangaId,
        volumeNumber,
        chapterNumber,
        chapterName,
        novelContext
      );

      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(400).json({ message: "Failed to add new chapter" });
        return;
      }

      const listImage = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const publicUrl = await uploadFile(
          file,
          HandleCode.FB_CHAPTER_IMAGE_FOLDER_PATH
        );
        listImage.push({ imageUrl: publicUrl, pageNumber: i + 1 });
      }

      result = await chapterService.updateChapterImages(
        result.chapterId,
        listImage
      );

      res.status(201).json({ message: "Add new chapter successfully" });
    } catch (error) {
      console.log("Failed to add new chapter:", error);
      res.status(500).json({ message: "Failed to add new chapter." });
    }
  }
  //#endregion

  //#region update-chapter
  async updateChapter(req, res) {
    const chapterId = parseInt(req.params.chapterId, 10);
    const { volumeNumber, chapterNumber, chapterName, novelContext } = req.body;
    try {
      let result = await chapterService.updateChapter(
        chapterId,
        volumeNumber,
        chapterNumber,
        chapterName,
        novelContext
      );

      const listImage = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const publicUrl = await uploadFile(
          file,
          HandleCode.FB_CHAPTER_IMAGE_FOLDER_PATH
        );
        listImage.push({ imageUrl: publicUrl, pageNumber: i + 1 });
      }

      if (listImage.length > 0) {
        result = await chapterService.updateChapterImages(chapterId, listImage);
      }

      res.status(200).json({ message: "Update chapter successfully." });
    } catch (err) {
      console.log("Failed to update chapter:", err);
      res.status(500).json({ message: "Failed to update chapter." });
    }
  }
  //#endregion

  //#region remove-chapter
  async removeChapter(req, res) {
    const chapterId = parseInt(req.params.chapterId, 10);
    try {
      const result = await chapterService.deleteChapter(chapterId);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to remove chapter:", err);
      res.status(500).json({ message: "Failed to remove chapter." });
    }
  }
  //#endregion
}

module.exports = new ChapterController();
