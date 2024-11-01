// src/routes/manga.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const mangaController = require("../app/controllers/MangaController.js");

/**
 * @swagger
 * /manga/list:
 *   get:
 *     tags: [Manga]
 *     summary: Get a paginated list of mangas with filtering
 *     description: Retrieve a paginated list of mangas, optionally filtering by update date, manga name, view count, like count, create date
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
 *           enum: [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009]
 *         description: Filter the list by update date, manga name, view count, like count, create date
 *         example: 5000
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *       400:
 *         description: Invalid filter type or pagination parameters
 *       500:
 *         description: Internal server error
 */
router.get("/list", mangaController.getListManga);

/**
 * @swagger
 * /manga/genre/{genreId}:
 *   get:
 *     tags: [Manga]
 *     summary: Get a paginated list of mangas by genre
 *     description: Retrieve a paginated list of mangas by genre
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the genre
 *         example: "1"
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
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *       400:
 *         description: Invalid genre ID or pagination parameters
 *       500:
 *         description: Internal server error
 */
router.get("/genre/:genreId", mangaController.getListMangaByGenre);

/**
 * @swagger
 * /manga/author/{authorId}:
 *   get:
 *     tags: [Manga]
 *     summary: Get a paginated list of mangas by author
 *     description: Retrieve a paginated list of mangas by author
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author
 *         example: "1"
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
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *       400:
 *         description: Invalid author ID or pagination parameters
 *       500:
 *         description: Internal server error
 */
router.get("/author/:authorId", mangaController.getListMangaByAuthor);

/**
 * @swagger
 * /manga:
 *   post:
 *     tags: [Manga]
 *     summary: Add new manga
 *     description: Add a new manga
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mangaName:
 *                 type: string
 *                 description: The name of the manga
 *                 example: "Manga 1"
 *               otherName:
 *                 type: string
 *                 description: The other name of the manga
 *                 example: "Manga 1"
 *               description:
 *                 type: string
 *                 description: The description of the manga
 *                 example: "Description"
 *               publishedYear:
 *                 type: string
 *                 description: The published year of the manga
 *                 example: "2022"
 *               ageLimit:
 *                 type: string
 *                 description: The age limit of the manga
 *                 example: "16"
 *               coverImage:
 *                 type: file
 *                 description: The cover image of the manga
 *               isManga:
 *                 type: boolean
 *                 description: Whether the manga is manga or not
 *                 example: true
 *               authorId:
 *                 type: string
 *                 description: The ID of the author
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Add new manga successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", upload.single("coverImage"), mangaController.addManga);

/**
 * @swagger
 * /manga/update-genres/{mangaId}:
 *   put:
 *     tags: [Manga]
 *     summary: Update manga genres
 *     description: Update manga genres
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manga
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["1", "2", "3"]
 *     responses:
 *       200:
 *         description: Update manga genres successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.put("/update-genres/:mangaId", mangaController.updateMangaGenres);

/**
 * @swagger
 * /manga/{mangaId}:
 *   get:
 *     tags: [Manga]
 *     summary: Get manga info
 *     description: Get manga info by manga id
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manga
 *         example: "6"
 *     responses:
 *       200:
 *         description: Get manga info successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.get("/:mangaId", mangaController.getMangaInfo);

/**
 * @swagger
 * /manga/{mangaId}:
 *   put:
 *     tags: [Manga]
 *     summary: Update manga
 *     description: Update manga information
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manga
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mangaName:
 *                 type: string
 *                 description: The name of the manga
 *                 example: "Manga 1"
 *               otherName:
 *                 type: string
 *                 description: The other name of the manga
 *                 example: "Manga 1"
 *               description:
 *                 type: string
 *                 description: The description of the manga
 *                 example: "Description"
 *               publishedYear:
 *                 type: string
 *                 description: The published year of the manga
 *                 example: "2022"
 *               ageLimit:
 *                 type: string
 *                 description: The age limit of the manga
 *                 example: "16"
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: The cover image of the manga, keep old value if send empty value
 *               isManga:
 *                 type: boolean
 *                 description: Whether the manga is manga or not
 *                 example: true
 *               authorId:
 *                 type: string
 *                 description: The ID of the author
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Update manga successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.put("/:mangaId", upload.single("coverImage"), mangaController.updateMangaInfo);

/**
 * @swagger
 * /manga/{mangaId}:
 *   delete:
 *     tags: [Manga]
 *     summary: Remove manga
 *     description: Remove manga by id
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manga
 *         example: "1"
 *     responses:
 *       200:
 *         description: Remove manga successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:mangaId", mangaController.removeManga);

module.exports = router;
