//src/routes/admin.js
const express = require("express");
const multer = require("multer");

const router = express.Router();

const authController = require("../app/controllers/AuthController.js");
const adminController = require("../app/controllers/AdminController.js");

router.get("/roles", adminController.getListRole);

router.get("/users", adminController.getListUser);

router.put("/ban/:userId", adminController.banUser);

router.post("/register", authController.registerAdmin);

router.put("/document/:docType", adminController.updateDocument);

router.put("/review/:reviewId", adminController.setReviewStatus);

module.exports = router;
