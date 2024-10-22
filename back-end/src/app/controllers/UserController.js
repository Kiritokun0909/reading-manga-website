// src/app/controllers/AuthController.js
const HandleCode = require("../../utilities/HandleCode");
const userService = require("../services/UserService");

class UserController {
  // [POST] /auth/register
  async registerUser(req, res) {
    return await registerAccount(req, res, userService.RoleEnum.USER);
  }

  // [POST] /admin/register
  async registerAdmin(req, res) {
    return await registerAccount(req, res, userService.RoleEnum.ADMIN);
  }

  // [GET] /account/{userId}
  async getUserInfo(req, res) {
    return await getInfo(req, res);
  }

  // [PUT] /account
  async updateUserInfo(req, res) {
    return await updateInfo(req, res);
  }

  // [PUT] /account/change-email
  async changeUserEmail(req, res) {
    return await changeEmail(req, res);
  }

  // [PUT] /account/change-password
  async changeUserPassword(req, res) {
    return await changePassword(req, res);
  }
}

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

const getInfo = async (req, res) => {
  const userId = req.params.userId;

  if (isNaN(userId) || userId < 1) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const result = await userService.getUserInfo(userId);

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

  console.log(userId, username, avatar, birthday, gender);

  if (isNaN(userId) || userId < 1) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const result = await userService.updateUserInfo(userId, username, avatar, birthday, gender);

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
}

const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (isNaN(userId) || userId < 1) {
    res.status(400).json({ error: "Invalid user id." });
    return;
  }

  try {
    const result = await userService.updateUserPassword(userId, oldPassword, newPassword);

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
}


module.exports = new UserController();