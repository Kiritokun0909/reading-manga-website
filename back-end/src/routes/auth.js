// src/routes/auth.js
const multer = require("multer");
const express = require("express");

const router = express.Router();
const upload = multer();

const authController = require("../app/controllers/AuthController.js");
const userController = require("../app/controllers/UserController.js");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     description: Register new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "tester@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               username:
 *                 type: string
 *                 example: "Tester"
 *     responses:
 *       200:
 *         description: Register account successfully
 *       409:
 *         description: Email is already existed
 *       500:
 *         description: Internal server error
 */
router.post("/register", upload.none(), userController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Login user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successfully
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", upload.none(), authController.login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags: [Auth]
 *     summary: Logout user
 *     description: Logout user account
 *     responses:
 *       200:
 *         description: Logout successfully
 */
router.get("/logout", authController.logout);

module.exports = router;
