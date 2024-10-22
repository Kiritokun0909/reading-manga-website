//src/routes/admin.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer();

const userController = require("../app/controllers/UserController.js");
const adminController = require("../app/controllers/AdminController.js");

/**
 * @swagger
 * /admin/register:
 *   post:
 *     tags: [Admin]
 *     summary: Register new admin
 *     description: Register new admin account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin123@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               username:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Register account successfully
 *       409:
 *         description: Email is already existed
 *       500:
 *         description: Internal server error
 */
router.post("/register", upload.none(), userController.registerAdmin);

/**
 * @swagger
 * /admin/roles:
 *   get:
 *     tags: [Admin]
 *     summary: Get list roles
 *     description: get list roles
 *     responses:
 *       200:
 *         description: Get list roles successfully
 *       500:
 *         description: Internal server error
 */
router.get("/roles", adminController.getListRole);

/**
 * @swagger
 * /admin/ban/{userId}:
 *   put:
 *     tags: [Admin]
 *     summary: Ban user
 *     description: Ban user
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
 *         description: Ban user successfully
 *       400:
 *         description: Invalid user id
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/ban/:userId", adminController.banUser);

module.exports = router;