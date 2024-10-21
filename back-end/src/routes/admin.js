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
 */
router.get("/roles", adminController.getRoles);



module.exports = router;