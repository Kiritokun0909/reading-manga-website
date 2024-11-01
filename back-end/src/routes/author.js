//src/routes/author.js
const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');  // Temporary folder for storage
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + file.originalname);  // Unique filename
    }
})
const upload = multer({ storage: storage });

const authorController = require("../app/controllers/AuthorController.js");

/**
 * @swagger
 * /author/list:
 *   get:
 *     tags: [Author]
 *     summary: Get a paginated list authors with filtering
 *     description: Retrieve a paginated list of authors, optionally filtering by author name or update date
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The page number for pagination
 *         example: 1
 *       - in: query
 *         name: itemsPerPage
 *         required: true
 *         schema:
 *           type: string
 *         description: The number of items per page
 *         example: 5
 *       - in: query
 *         name: filter
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [4000, 4001, 4002, 4003]
 *         description: Filter the list by update date or author name
 *         example: 4000
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *       400:
 *         description: Invalid filter type or pagination parameters
 *       500:
 *         description: Internal server error
 */

router.get("/list", authorController.getListAuthor);

/**
 * @swagger
 * /author:
 *   post:
 *     tags: [Author]
 *     summary: Add new author with image
 *     description: Add a new author with an avatar image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               authorName:
 *                 type: string
 *                 example: "Author name"
 *               avatar:
 *                 type: file
 *                 description: Upload the author's avatar image
 *               biography:
 *                 type: string
 *                 example: "Biography"
 *     responses:
 *       200:
 *         description: Add new author successfully              
 *       500:
 *         description: Internal server error
 */
router.post("/", upload.single('avatar'), authorController.addAuthor);

/**
 * @swagger
 * /author/{authorId}:
 *   get:
 *     tags: [Author]
 *     summary: Get author info
 *     description: Get author info by author id
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *         example: "6"
 *     responses:
 *       200:
 *         description: Get author info sucessfully
 *       400:
 *         description: Invalid author id
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.get("/:authorId", authorController.getAuthorInfo);

/**
 * @swagger
 * /author/{authorId}:
 *   put:
 *     tags: [Author]
 *     summary: Update author
 *     description: Update author information
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:  
 *               authorName:
 *                 type: string
 *                 example: "New author name"
 *                 description: Keep old value if send empty value
 *               avatar:
 *                 type: file
 *                 description: Upload the author's avatar image, keep old value if send empty value
 *               biography:
 *                 type: string
 *                 example: "Update Biography"
 *                 description: Still update if send empty value
 *     responses:
 *       200:
 *         description: Update author successfully
 *       400:
 *         description: Invalid author id
 *       404:
 *         description: Author is not found
 *       500:
 *         description: Internal server error
 */
router.put("/:authorId", upload.single('avatar'), authorController.updateAuthor);

/**
 * @swagger
 * /author/{authorId}:
 *   delete:
 *     tags: [Author]
 *     summary: Remove author
 *     description: Remove author
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *         example: "1"
 *     responses:
 *       200:
 *         description: Remove author successfully
 *       400:
 *         description: Invalid author id
 *       404:
 *         description: Author is not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:authorId", authorController.removeAuthor);

module.exports = router;