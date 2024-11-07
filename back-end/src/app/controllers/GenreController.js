const genreService = require("../services/GenreService.js");

const HandleCode = require("../../utilities/HandleCode.js");

class GenreController {
  //#region get-list-genre
  async getListGenre(req, res) {
    try {
      const result = await genreService.getGenres();
      res.status(200).json(result.genres);
    } catch (err) {
      console.log("Failed to get list genres:", err);
      res.status(500).json({
        message: "Failed to get list genres. Please try again later.",
      });
    }
  }
  //#endregion

  //#region add-genre
  async addGenre(req, res) {
    const { genreName } = req.body;
    try {
      const result = await genreService.addGenre(genreName);

      if (result && result.code == HandleCode.GENRE_EXIST) {
        res
          .status(409)
          .json({ message: "Genre is already existed. Try another name." });
        return;
      }

      res.status(200).json({ message: "Add new genre successfully." });
    } catch (err) {
      console.log("Failed to add new genre:", err);
      res
        .status(500)
        .json({ message: "Failed to add new genre. Please try again later." });
    }
  }
  //#endregion

  //#region update-genre
  async updateGenre(req, res) {
    const { genreId } = req.params;
    const { genreName } = req.body;
    try {
      const result = await genreService.updateGenre(genreId, genreName);

      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "Genre not found." });
        return;
      }

      if (result && result.code == HandleCode.GENRE_EXIST) {
        res
          .status(409)
          .json({ message: "Genre is already existed. Try another name." });
        return;
      }

      res.status(200).json({ message: "Update genre successfully." });
    } catch (err) {
      console.log("Failed to update genre:", err);
      res
        .status(500)
        .json({ message: "Failed to update genre. Please try again later." });
    }
  }
  //#endregion

  //#region remove-genre
  async removeGenre(req, res) {
    const { genreId } = req.params;

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
  }
  //#endregion
}

module.exports = new GenreController();
