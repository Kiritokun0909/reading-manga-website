// src/app/controllers/AuthController.js
const HandleCode = require("../../utilities/HandleCode");
const userService = require("../services/UserService");
const { uploadFile } = require("../../utilities/UploadFile.js");

class UserController {
  //#region register-account
  async registerUser(req, res) {
    return await registerAccount(req, res, userService.RoleEnum.USER);
  }

  async registerAdmin(req, res) {
    return await registerAccount(req, res, userService.RoleEnum.ADMIN);
  }
  //#endregion

  //#region manage-account
  async getUserInfo(req, res) {
    return await getInfo(req, res);
  }

  async updateUserInfo(req, res) {
    return await updateInfo(req, res);
  }

  async changeUserEmail(req, res) {
    return await changeEmail(req, res);
  }

  async changeUserPassword(req, res) {
    return await changePassword(req, res);
  }
  //#endregion

  //#region like-unlike-manga
  async likeManga(req, res) {
    return await likeManga(req, res);
  }

  async unlikeManga(req, res) {
    return await unlikeManga(req, res);
  }
  //#endregion

  //#region follow-unfollow-manga
  async followManga(req, res) {
    return await followManga(req, res);
  }

  async unfollowManga(req, res) {
    return await unfollowManga(req, res);
  }
  //#endregion

  //#region check-user-like-follow
  async isLike(req, res) {
    return await isLike(req, res);
  }

  async isFollow(req, res) {
    return await isFollow(req, res);
  }
  //#endregion

  //#region get-list-like-follow
  async getListLike(req, res) {
    return await getListLike(req, res);
  }

  async getListFollow(req, res) {
    return await getListFollow(req, res);
  }
  //#endregion
}

module.exports = new UserController();

//#region implement register-account
const registerAccount = async (req, res, role) => {
  const { username, email, password } = req.body;
  try {
    const result = await userService.register(username, email, password, role);

    if (result && result.code == HandleCode.EMAIL_EXIST) {
      res
        .status(409)
        .json({ message: "Email is already existed. Try another email." });
      return;
    }

    res.status(201).json({ message: "Register account successfully." });
  } catch (err) {
    console.log("Failed to register account:", err);
    res
      .status(500)
      .json({ message: "Failed to register account. Please try again later." });
  }
};
//#endregion

//#region implement manage-account
const getInfo = async (req, res) => {
  const userId = req.params.userId;

  if (isNaN(userId) || userId < 1) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const result = await userService.getUserById(userId);

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
};

const updateInfo = async (req, res) => {
  const { userId, username, avatar, birthday, gender } = req.body;

  if (isNaN(userId) || userId < 1) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const currentUser = await userService.getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    let imageUrl = currentUser.avatar; // Default to existing avatar

    // If a new avatar file is uploaded, handle it
    if (req.file) {
      imageUrl = await uploadFile(
        req.file,
        HandleCode.FB_USER_AVATAR_FOLDER_PATH
      );
    }

    const result = await userService.updateUserInfo(
      userId,
      username,
      imageUrl,
      birthday,
      gender
    );

    res.status(200).json({ message: "Update info successfully." });
  } catch (err) {
    console.log("Failed to update user info:", err);
    res
      .status(500)
      .json({ message: "Failed to update info. Please try again later." });
  }
};

const changeEmail = async (req, res) => {
  const { userId, email } = req.body;

  if (isNaN(userId) || userId < 1) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

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
};

const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (isNaN(userId) || userId < 1) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

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
    res
      .status(500)
      .json({ message: "Failed to change password. Please try again later." });
  }
};
//#endregion

//#region implement like-unlike-manga
const likeManga = async (req, res) => {
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
};

const unlikeManga = async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;

  try {
    const result = await userService.unlikeManga(mangaId, userId);
    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Manga not found or user already unlike this manga." });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to like manga:", err);
    res
      .status(500)
      .json({ message: "Failed to unlike manga. Please try again later." });
  }
};
//#endregion

//#region implement follow-unfollow-manga
const followManga = async (req, res) => {
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
};

const unfollowManga = async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;

  try {
    const result = await userService.unfollowManga(mangaId, userId);
    if (result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Manga not found or user already unlike this manga." });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to unfollow manga:", err);
    res
      .status(500)
      .json({ message: "Failed to unfollow manga. Please try again later." });
  }
};
//#endregion

//#region implement check-user-like-follow-manga
const isLike = async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;
  try {
    const result = await userService.isLikeManga(mangaId, userId);
    if(result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Manga not found or user already unlike this manga." });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to check user like manga:", err);
    res
      .status(500)
      .json({ message: "Failed to check user like manga. Please try again later." });
  }
};

const isFollow = async (req, res) => {
  const { mangaId } = req.params;
  const userId = req.user.id;
  try {
    const result = await userService.isFollowManga(mangaId, userId);
    if(result && result.code == HandleCode.NOT_FOUND) {
      res.status(404).json({ message: "Manga not found or user already unfollow this manga." });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to check user follow manga:", err);
    res
      .status(500)
      .json({ message: "Failed to check user follow manga. Please try again later." });
  }
};
//#endregion

//#region implement get-list-like-follow
const getListLike = async (req, res) => {
  const { pageNumber, itemsPerPage } = req.query;
  const userId = req.user.id;

  try {
    const result = await userService.getListLikeManga(userId, parseInt(pageNumber), parseInt(itemsPerPage));
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to get list like manga:", err);
    res
      .status(500)
      .json({ message: "Failed to get list like manga. Please try again later." });
  }
};

const getListFollow = async (req, res) => {
  const { pageNumber, itemsPerPage } = req.query;
  const userId = req.user.id;
  try {
    const result = await userService.getListFollowManga(userId, parseInt(pageNumber), parseInt(itemsPerPage));
    res.status(200).json(result);
  } catch (err) {
    console.log("Failed to get list follow manga:", err);
    res
      .status(500)
      .json({ message: "Failed to get list follow manga. Please try again later." });
  }
};
//#endregion

