// src/app/controllers/AuthorController.js
const authorService = require("../services/AuthorService.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { uploadFile } = require("../../utilities/UploadFile.js");

class AuthorController {
  // [GET] /author/list?pageNumber={pageNumber}&itemsPerPage={itemsPerPage}&filter={filter}
  async getListAuthor(req, res) {
    return await getListAuthor(req, res);
  }

  // [GET] /author/{authorId}
  async getAuthorInfo(req, res) {
    return await getAuthor(req, res);
  }

  // [POST] /author
  async addAuthor(req, res) {
    return await addAuthor(req, res);
  }

  // [PUT] /author/{authorId}
  async updateAuthor(req, res) {
    return await updateAuthor(req, res);
  }

  // [DELETE] /author/{authorId}
  async removeAuthor(req, res) {
    return await removeAuthor(req, res);
  }
}


const getListAuthor = async (req, res) => {
  const { pageNumber, itemsPerPage, filter } = req.query;
  try{
    const result = await authorService.getListAuthor(parseInt(pageNumber), parseInt(itemsPerPage), filter);
    res.status(200).json(result);
  } catch(err) {
    console.log("Failed to get list authors:",err);
    res
      .status(500)
      .json({ message: "Failed to get list authors. Please try again later." });
  }
}


const getAuthor = async (req, res) => {
  const { authorId } = req.params;
  try {
    const result = await authorService.getAuthorById(authorId);

    if (result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Author not found." });
      return;
    }

    res.status(200).json(result.authorInfo);
  } catch (err) {
    console.log("Failed to get author info:", err);
    res
      .status(500)
      .json({ message: "Failed to get author info. Please try again later." });
  }
};


const addAuthor = async (req, res) => {
  const { authorName, biography } = req.body;
  try {
    let imageUrl = "";
    if(req.file) {
      imageUrl = await uploadFile(req.file, HandleCode.FB_AUTHOR_AVATAR_FOLDER_PATH);
    }
    const result = await authorService.addAuthor(imageUrl, authorName, biography);
    res.status(200).json({ message: "Add new author successfully." });
  } catch (err) {
    console.log("Failed to add new author:", err);
    res
      .status(500)
      .json({ message: "Failed to add new author. Please try again later." });
  }
};

const updateAuthor = async (req, res) => {
  const { authorId } = req.params;
  const { authorName, biography } = req.body;
  try {
    let imageUrl = ""; 
    if (req.file) {
      imageUrl = await uploadFile(req.file, HandleCode.FB_AUTHOR_AVATAR_FOLDER_PATH);
    }
    const result = await authorService.updateAuthor(authorId, imageUrl, authorName, biography);

    if(result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Author not found." });
      return;
    }

    res.status(200).json({ message: "Update author successfully." });
  } catch (err) {
    console.log("Failed to update author:", err);
    res
      .status(500)
      .json({ message: "Failed to update author. Please try again later." });
  }
};

const removeAuthor = async (req, res) => {
  const { authorId } = req.params;
  try {
    const result = await authorService.removeAuthor(authorId);

    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Author not found." });
      return;
    }

    res.status(200).json({ message: "Remove author successfully." });
  } catch (err) {
    console.log("Failed to remove author:", err);
    res
      .status(500)
      .json({ message: "Failed to remove author. Please try again later." });
  }
};

module.exports = new AuthorController();
