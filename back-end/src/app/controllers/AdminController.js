// src/app/controllers/AdminController.js

const roleService = require("../services/RoleService.js");
const userService = require("../services/UserService.js");
const HandleCode = require("../../utilities/HandleCode.js");

class AdminController {
  // [GET] /roles
  async getListRole(req, res) {
    return await getRoles(req, res);
  }

  // [PUT] /ban/{userId}
  async banUser(req, res) {
    return await banUser(req, res);
  }
}

const getRoles = async (req, res) => {
  try {
    const result = await roleService.getRoles();
    res.status(200).json(result.roles);
  } catch (err) {
    console.log("Failed to get list roles:", err);
    res
      .status(500)
      .json({ message: "Failed to get list roles. Please try again later." });
  }
};

const banUser = async (req, res) => {
  const { userId } = req.params;
  const { isBanned } = req.query;
  try {
    const result = await userService.setUserBanStatus(userId, isBanned);
    if (result && result.code == HandleCode.NOT_FOUND) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "Ban user successfully." });
  } catch (err) {
    console.log("Failed to ban user:", err);
    res
      .status(500)
      .json({ message: "Failed to ban user. Please try again later." });
  }
};

module.exports = new AdminController();
