// src/app/controllers/AuthController.js
const HandleCode = require("../../utilities/HandleCode");
const userService = require("../services/UserService");
const notificationService = require("../services/NotificationService");
const { uploadFile } = require("../../utilities/UploadFile");

class UserController {
  //#region get-info
  async getUserInfo(req, res) {
    let userId = req.params.userId;
    if (userId == 0) userId = req.user.id;
    try {
      const result = await userService.getUserInfoById(userId);
      if (result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      res.status(200).json(result.userInfo);
    } catch (err) {
      console.log("Failed to get user info:", err);
      res
        .status(500)
        .json({ message: "Failed to get user info. Please try again later." });
    }
  }
  //#endregion

  //#region update-info
  async updateUserInfo(req, res) {
    const { username } = req.body;
    const userId = req.user.id;
    try {
      let imageUrl = ""; // Default to existing avatar
      if (req.file) {
        imageUrl = await uploadFile(
          req.file,
          HandleCode.FB_USER_AVATAR_FOLDER_PATH
        );
      }

      const result = await userService.updateUserInfo(
        userId,
        username,
        imageUrl
      );
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      res.status(200).json({ message: "Update info successfully." });
    } catch (err) {
      console.log("Failed to update user info:", err);
      res
        .status(500)
        .json({ message: "Failed to update info. Please try again later." });
    }
  }
  //#endregion

  //#region change-mail
  async changeUserEmail(req, res) {
    const { email } = req.body;
    const userId = req.user.id;
    try {
      const result = await userService.updateUserEmail(userId, email);

      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      if (result && result.code == HandleCode.EMAIL_EXIST) {
        res
          .status(409)
          .json({ message: "Email is already existed. Try another email." });
        return;
      }

      res.status(200).json({ message: "Change email successfully." });
    } catch (err) {
      console.log("Failed to change user email:", err);
      res
        .status(500)
        .json({ message: "Failed to change email. Please try again later." });
    }
  }
  //#endregion

  //#region change-pwd
  async changeUserPassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
      const result = await userService.updateUserPassword(
        userId,
        oldPassword,
        newPassword
      );

      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      if (result && result.code == HandleCode.PASSWORD_NOT_MATCH) {
        res.status(400).json({ message: "Old password is not correct." });
        return;
      }

      res.status(200).json({ message: "Change password successfully." });
    } catch (err) {
      console.log("Failed to change user password:", err);
      res.status(500).json({
        message: "Failed to change password. Please try again later.",
      });
    }
  }
  //#endregion

  //#region like-manga
  async likeManga(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;

    try {
      const result = await userService.likeManga(mangaId, userId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "Manga not found." });
        return;
      }
      if (result && result.code == HandleCode.USER_ALREADY_LIKE) {
        res.status(403).json({ message: "User already like this manga." });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to like manga:", err);
      res
        .status(500)
        .json({ message: "Failed to like manga. Please try again later." });
    }
  }

  async unlikeManga(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;

    try {
      const result = await userService.unlikeManga(mangaId, userId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({
          message: "Manga not found or user already unlike this manga.",
        });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to like manga:", err);
      res
        .status(500)
        .json({ message: "Failed to unlike manga. Please try again later." });
    }
  }
  //#endregion

  //#region follow-manga
  async followManga(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;
    try {
      const result = await userService.followManga(mangaId, userId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "Manga not found." });
        return;
      }
      if (result && result.code == HandleCode.USER_ALREADY_LIKE) {
        res.status(403).json({ message: "User already follow this manga." });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to follow manga:", err);
      res
        .status(500)
        .json({ message: "Failed to follow manga. Please try again later." });
    }
  }

  async unfollowManga(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;
    try {
      const result = await userService.unfollowManga(mangaId, userId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({
          message: "Manga not found or user already unlike this manga.",
        });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to unfollow manga:", err);
      res
        .status(500)
        .json({ message: "Failed to unfollow manga. Please try again later." });
    }
  }
  //#endregion

  //#region check-like
  async isLike(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;
    try {
      const result = await userService.isLikeManga(mangaId, userId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({
          message: "Manga not found or user already unlike this manga.",
        });
        return;
      }

      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to check user like manga:", err);
      res.status(500).json({
        message: "Failed to check user like manga. Please try again later.",
      });
    }
  }
  //#endregion

  //#region check-follow
  async isFollow(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;
    try {
      const result = await userService.isFollowManga(mangaId, userId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({
          message: "Manga not found or user already unfollow this manga.",
        });
        return;
      }

      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to check user follow manga:", err);
      res.status(500).json({
        message: "Failed to check user follow manga. Please try again later.",
      });
    }
  }
  //#endregion

  //#region get-list-like
  async getListLike(req, res) {
    const { pageNumber, itemsPerPage } = req.query;
    const userId = req.user.id;
    try {
      const result = await userService.getListMangaUserLike(
        parseInt(pageNumber),
        parseInt(itemsPerPage),
        userId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get list like manga:", err);
      res.status(500).json({
        message: "Failed to get list like manga. Please try again later.",
      });
    }
  }
  //#endregion

  //#region get-list-follow
  async getListFollow(req, res) {
    const { pageNumber, itemsPerPage } = req.query;
    const userId = req.user.id;
    try {
      const result = await userService.getListMangaUserFollow(
        parseInt(pageNumber),
        parseInt(itemsPerPage),
        userId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get list follow manga:", err);
      res.status(500).json({
        message: "Failed to get list follow manga. Please try again later.",
      });
    }
  }
  //#endregion

  //#region user-review
  async addReview(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;
    const { context } = req.body;
    try {
      const result = await userService.addReview(userId, mangaId, context);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to add review:", err);
      res.status(500).json({
        message: "Failed to add review. Please try again later.",
      });
    }
  }
  //#endregion

  //#region count-unread-notification
  async countUnreadNotification(req, res) {
    const userId = req.user.id;
    try {
      const result = await notificationService.countUnreadNotification(userId);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to count unread notification:", err);
      res.status(500).json({
        message: "Failed to count unread notification. Please try again later.",
      });
    }
  }

  //#region get-notification
  async getNotification(req, res) {
    const { pageNumber, itemsPerPage } = req.query;
    const userId = req.user.id;
    try {
      const result = await notificationService.getNotifications(
        parseInt(itemsPerPage),
        parseInt(pageNumber),
        userId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get notification:", err);
      res.status(500).json({
        message: "Failed to get notification. Please try again later.",
      });
    }
  }
  //#endregion

  //#region read-notification
  async readNotification(req, res) {
    const { notificationId } = req.params;
    try {
      const result = await notificationService.readNotification(notificationId);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to read notification:", err);
      res.status(500).json({
        message: "Failed to read notification. Please try again later.",
      });
    }
  }
}

module.exports = new UserController();
