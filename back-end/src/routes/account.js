// src/routes/account.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

const userController = require("../app/controllers/UserController.js");

/**
 * @swagger
 * /account/get-info/{userId}:
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
router.get("/get-info/:userId", userController.getUserInfo);

/**
 * @swagger
 * /account/update-info:
 *   post:
 *     tags: [Account]
 *     summary: Update account info
 *     description: Update account info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 type: string
 *                 example: "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png"
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
router.post("/update-info", userController.updateUserInfo);

/**
 * @swagger
 * /account/change-email:
 *   post:
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
router.post("/change-email", userController.changeEmail);

/**
 * @swagger
 * /account/change-password:
 *   post:
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
router.post("/change-password", userController.changePassword);

module.exports = router;
