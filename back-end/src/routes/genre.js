//src/routes/genre.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer();

const genreController = require("../app/controllers/GenreController.js");

/**
 * @swagger
 * /genre/list:
 *   get:
 *     tags: [Genre]
 *     summary: Get list genres
 *     description: Get list genres
 *     responses:
 *       200:
 *         description: Get list genres successfully
 *       500:
 *         description: Internal server error
 */
router.get("/list", genreController.getListGenre);

/**
 * @swagger
 * /genre:
 *   post:
 *     tags: [Genre]
 *     summary: Add new genre
 *     description: add new genre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               genreName:
 *                 type: string
 *                 example: "New genre name"
 *     responses:
 *       200:
 *         description: Add new genre successfully              
 *       500:
 *         description: Internal server error
 */
router.post("/", genreController.addGenre);

/**
 * @swagger
 * /genre/{genreId}:
 *   put:
 *     tags: [Genre]
 *     summary: Update genre
 *     description: Update genre
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genre
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:  
 *               genreName:
 *                 type: string
 *                 example: "New genre name"
 *     responses:
 *       200:
 *         description: Update genre successfully
 *       400:
 *         description: Invalid genre id
 *       404:
 *         description: Genre is not found
 *       500:
 *         description: Internal server error
 */
router.put("/:genreId", genreController.updateGenre);

/**
 * @swagger
 * /genre/{genreId}:
 *   delete:
 *     tags: [Genre]
 *     summary: Remove genre
 *     description: remove genre
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genre
 *         example: "1"
 *     responses:
 *       200:
 *         description: Remove genre successfully
 *       400:
 *         description: Invalid genre id
 *       404:
 *         description: Genre is not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:genreId", genreController.removeGenre);

module.exports = router;