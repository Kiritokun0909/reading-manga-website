// src/routes/account.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const userController = require("../app/controllers/UserController.js");

/**
 * @swagger
 * /account/like-list:
 *   get:
 *     tags: [Account]
 *     summary: Get a paginated list of liked mangas 
 *     description: Retrieve a paginated list of liked mangas order by date of like
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
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *       400:
 *         description: Invalid filter type or pagination parameters
 *       500:
 *         description: Internal server error
 */
router.get("/like-list", userController.getListLike);

/**
 * @swagger
 * /account/follow-list:
 *   get:
 *     tags: [Account]
 *     summary: Get a paginated list of followed mangas 
 *     description: Retrieve a paginated list of liked followed order by date of follow
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
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *       400:
 *         description: Invalid filter type or pagination parameters
 *       500:
 *         description: Internal server error
 */
router.get("/follow-list", userController.getListFollow);

/**
 * @swagger
 * /account/change-email:
 *   put:
 *     tags: [Account]
 *     summary: Change user email
 *     description: Change user email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "11"
 *               email:
 *                 type: string
 *                 example: "tester123@gmail.com"
 *     responses:
 *       200:
 *         description: Update email successfully
 *       404:
 *         description: User is not found
 *       409:
 *         description: Email is already existed
 *       500:
 *         description: Internal server error
 */
router.put("/change-email", userController.changeUserEmail);

/**
 * @swagger
 * /account/change-password:
 *   put:
 *     tags: [Account]
 *     summary: Change user password
 *     description: Change user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "11"
 *               oldPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Update password successfully
 *       404:
 *         description: User is not found
 *       500:
 *         description: Internal server error
 */
router.put("/change-password", userController.changeUserPassword);

/**
 * @swagger
 * /account:
 *   put:
 *     tags: [Account]
 *     summary: Update account info
 *     description: Update account info
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "6"
 *               username:
 *                 type: string
 *                 example: "admin123"
 *               avatar:
 *                 type: file
 *                 description: Upload the author's avatar image, keep old value if send empty value
 *               birthday:
 *                 type: string
 *                 example: "2000-01-01"
 *               gender:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Update account info sucessfully
 *       400:
 *         description: Invalid user id
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/", upload.single("avatar"), userController.updateUserInfo);

/**
 * @swagger
 * /account/like/{mangaId}:
 *   post:
 *     tags: [Account]
 *     summary: Like manga
 *     description: User like manga with mangaId
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the manga 
 *         example: 1
 *     responses:
 *       200:
 *         description: Like manga successfully
 *       403:
 *         description: User already like this manga
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags: [Account]
 *     summary: Unlike manga
 *     description: User unlike manga with mangaId
 *     parameters:
 *       - in: path
 *         name: mangaId    
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the manga 
 *         example: 1
 *     responses:
 *       200:
 *         description: Unlike manga successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.post("/like/:mangaId", userController.likeManga);
router.delete("/like/:mangaId", userController.unlikeManga);

/**
 * @swagger
 * /account/follow/{mangaId}:
 *   post:
 *     tags: [Account]
 *     summary: Follow a manga
 *     description: Follow a manga
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the manga to follow
 *         example: 1
 *     responses:
 *       200:
 *         description: Follow manga successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags: [Account]
 *     summary: Unfollow a manga
 *     description: Unfollow a manga
 *     parameters:
 *       - in: path
 *         name: mangaId    
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the manga 
 *         example: 1
 *     responses:
 *       200:
 *         description: Unfollow manga successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.post("/follow/:mangaId", userController.followManga);
router.delete("/follow/:mangaId", userController.unfollowManga);

/**
 * @swagger
 * /account/is-like/{mangaId}:
 *   get:
 *     tags: [Account]
 *     summary: Check user like manga
 *     description: Check user like manga
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the manga 
 *         example: 1
 *     responses:
 *       200:
 *         description: Check user like manga successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.get("/is-like/:mangaId", userController.isLike);

/**
 * @swagger
 * /account/is-follow/{mangaId}:
 *   get:
 *     tags: [Account]
 *     summary: Check user follow manga
 *     description: Check user follow manga
 *     parameters:
 *       - in: path
 *         name: mangaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the manga 
 *         example: 1
 *     responses:
 *       200:
 *         description: Check user follow manga successfully
 *       400:
 *         description: Invalid manga id
 *       404:
 *         description: Manga not found
 *       500:
 *         description: Internal server error
 */
router.get("/is-follow/:mangaId", userController.isFollow);

/**
 * @swagger
 * /account/{userId}:
 *   get:
 *     tags: [Account]
 *     summary: Get account info
 *     description: Get account info by user id
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *         example: "6"
 *     responses:
 *       200:
 *         description: Get account info sucessfully
 *       400:
 *         description: Invalid user id
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", userController.getUserInfo);


module.exports = router;
