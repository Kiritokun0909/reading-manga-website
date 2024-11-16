// src/routes/account.js
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const userController = require("../app/controllers/UserController.js");

router.get("/like-list", userController.getListLike);

router.get("/follow-list", userController.getListFollow);

router.put("/change-email", userController.changeUserEmail);

router.put("/change-password", userController.changeUserPassword);

router.put("/", upload.single("avatar"), userController.updateUserInfo);

router.get("/is-like/:mangaId", userController.isLike);
router.get("/is-follow/:mangaId", userController.isFollow);

router.post("/like/:mangaId", userController.likeManga);
router.delete("/like/:mangaId", userController.unlikeManga);

router.post("/follow/:mangaId", userController.followManga);
router.delete("/follow/:mangaId", userController.unfollowManga);

router.get("/:userId", userController.getUserInfo);

module.exports = router;
