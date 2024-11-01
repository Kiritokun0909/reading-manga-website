// src/app/controllers/AuthorController.js
const mangaService = require("../services/MangaService.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { uploadFile } = require("../../utilities/UploadFile.js");

class AuthorController {
  // [GET] /manga/list?pageNumber={pageNumber}&itemsPerPage={itemsPerPage}&filter={filter}
  async getListManga(req, res) {
    return await getListManga(req, res);
  }

  async getListMangaByGenre(req, res) {
    return await getListMangaByGenre(req, res);
  }

  async getListMangaByAuthor(req, res) {
    return await getListMangaByAuthor(req, res);
  }

  // [GET] /manga/{mangaId}
  async getMangaInfo(req, res) {
    return await getMangaInfo(req, res);
  }

  // [POST] /manga
  async addManga(req, res) {
    return await addManga(req, res);
  }

  // [PUT] /manga/{mangaId}
  async updateMangaInfo(req, res) {
    return await updateMangaInfo(req, res);
  }

  // [DELETE] /manga/{mangaId}
  async removeManga(req, res) {
    return await removeManga(req, res);
  }

  async updateMangaGenres(req, res) {
    return await updateMangaGenres(req, res);
  }
}

const getListManga = async (req, res) => {
  const { pageNumber, itemsPerPage, filter } = req.query;
  try {
    const result = await mangaService.getListManga(
      parseInt(pageNumber),
      parseInt(itemsPerPage),
      filter
    );
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to get list mangas:", err);
    res
      .status(500)
      .json({ message: "Failed to get list mangas. Please try again later." });
  }
};

const getMangaInfo = async (req, res) => {
  const { mangaId } = req.params;
  try {
    const result = await mangaService.getMangaById(mangaId);
    if(result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Manga not found." });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to get manga info:", err);
    res
      .status(500)
      .json({ message: "Failed to get manga info. Please try again later." });
  }
};

const addManga = async (req, res) => {
  const {
    mangaName, otherName, publishedYear,
    description, ageLimit, isManga, 
    authorId,
  } = req.body;
  try {
    let coverImageUrl = "";
    if(req.file) {
      coverImageUrl = await uploadFile(req.file, HandleCode.FB_COVER_IMAGE_FOLDER_PATH);
    } console.log(isManga);
    const result = await mangaService.addManga(
      mangaName, otherName, coverImageUrl, publishedYear,
      description, ageLimit, isManga,
      authorId,
    );
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to add manga:", err);
    res
      .status(500)
      .json({ message: "Failed to add manga. Please try again later." });
  }
};

const updateMangaInfo = async (req, res) => {
  const { mangaId } = req.params;
  const {
    mangaName, otherName, publishedYear, 
    description, ageLimit, isManga, 
    authorId,
  } = req.body;
  try {
    let coverImageUrl = "";
    if (req.file) {
      coverImageUrl = await uploadFile(req.file, HandleCode.FB_COVER_IMAGE_FOLDER_PATH);
    } 
    const result = await mangaService.updateMangaInfo(
      mangaId, mangaName, otherName,
      coverImageUrl, publishedYear, description,
      ageLimit, isManga,
      authorId
    );
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to update manga info:", err);
    res.status(500).json({
      message: "Failed to update manga info. Please try again later.",
    });
  }
};

const removeManga = async (req, res) => {
  const { mangaId } = req.params;

  if (isNaN(mangaId) || mangaId < 1) {
    res.status(400).json({ error: "Invalid manga id." });
    return;
  }

  try {
    const result = await mangaService.removeManga(mangaId);
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to remove manga:", err);
    res
      .status(500)
      .json({ message: "Failed to remove manga. Please try again later." });
  }
};

const updateMangaGenres = async (req, res) => {
  const { mangaId } = req.params;
  const { genreIds } = req.body;
  try {
    const result = await mangaService.updateMangaGenres(mangaId, genreIds);
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to update manga genres:", err);
    res
      .status(500)
      .json({ message: "Failed to update manga genres. Please try again later." });
  }
};

const getListMangaByGenre = async (req, res) => {
  const { genreId } = req.params;
  try {
    const result = await mangaService.getListMangaByGenreId(genreId);
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to get list manga by genre:", err);
    res
      .status(500)
      .json({ message: "Failed to get list manga by genre. Please try again later." });
  }
};

const getListMangaByAuthor = async (req, res) => {
  const { authorId } = req.params;
  try {
    const result = await mangaService.getListMangaByAuthorId(authorId);
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to get list manga by author:", err);
    res
      .status(500)
      .json({ message: "Failed to get list manga by author. Please try again later." });
  }
};

module.exports = new AuthorController();
