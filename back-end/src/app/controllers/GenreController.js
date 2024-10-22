const genreService = require("../services/GenreService.js");

const HandleCode = require("../../utilities/HandleCode.js");

class GenreController {
  // [GET] /genre/list
  async getListGenre(req, res) {
    await getListGenre(req, res);
  }

  // [POST] /genre
  async addGenre(req, res) {
    await addGenre(req, res);
  }

  // [PUT] /genre/{genreId}
  async updateGenre(req, res) {
    await updateGenre(req, res);
  }

  // [DELETE] /genre/{genreId}
  async removeGenre(req, res) {
    await removeGenre(req, res);
  }
}

const getListGenre = async (req, res) => {
  try {
    const result = await genreService.getGenres();
    res.status(200).json(result.genres);
  } catch (err) {
    console.log("Failed to get list genres:", err);
    res
      .status(500)
      .json({ message: "Failed to get list genres. Please try again later." });
  }
};

const addGenre = async (req, res) => {
  const { genreName } = req.body;
  try {
    await genreService.addGenre(genreName);
    res.status(200).json({ message: "Add new genre successfully." });
  } catch (err) {
    console.log("Failed to add new genre:", err);
    res
      .status(500)
      .json({ message: "Failed to add new genre. Please try again later." });
  }
};

const updateGenre = async (req, res) => {
  const { genreId } = req.params;

  if (isNaN(genreId) || genreId < 1) {
    res.status(400).json({ error: "Invalid genre id." });
    return;
  }

  const { genreName } = req.body;
  try {
    const result = await genreService.updateGenre(genreId, genreName);

    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Genre not found." });
      return;
    }

    res.status(200).json({ message: "Update genre successfully." });
  } catch (err) {
    console.log("Failed to update genre:", err);
    res
      .status(500)
      .json({ message: "Failed to update genre. Please try again later." });
  }
};

const removeGenre = async (req, res) => {
  const { genreId } = req.params;

  if (isNaN(genreId) || genreId < 1) {
    res.status(400).json({ error: "Invalid genre id." });
    return;
  }

  try {
    const result = await genreService.removeGenre(genreId);

    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Genre not found." });
      return;
    }

    res.status(200).json({ message: "Remove genre successfully." });
  } catch (err) {
    console.log("Failed to remove genre:", err);
    res
      .status(500)
      .json({ message: "Failed to remove genre. Please try again later." });
  }
};

module.exports = new GenreController();
