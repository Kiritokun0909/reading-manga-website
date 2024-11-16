//src/routes/admin.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer();

const authController = require("../app/controllers/AuthController.js");
const adminController = require("../app/controllers/AdminController.js");

// router.post("/register", upload.none(), userController.registerAdmin);

router.get("/roles", adminController.getListRole);

router.get("/users", adminController.getListUser);

router.put("/ban/:userId", adminController.banUser);

router.post("/register", authController.registerAdmin);

router.put("/document/:docType", adminController.updateDocument);

module.exports = router;
