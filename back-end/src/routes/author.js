//src/routes/author.js
const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Temporary folder for storage
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage });

const authorController = require("../app/controllers/AuthorController.js");

router.get("/list", authorController.getListAuthor);

router.post("/", upload.single("avatar"), authorController.addAuthor);

router.get("/:authorId", authorController.getAuthorInfo); // not use

router.put(
  "/:authorId",
  upload.single("avatar"),
  authorController.updateAuthor
);

router.delete("/:authorId", authorController.removeAuthor);

module.exports = router;
