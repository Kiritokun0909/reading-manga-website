// src/app/controllers/AdminController.js

const roleService = require("../services/RoleService.js");
const HandleCode = require("../../utilities/HandleCode.js");

class AdminController {
  // [GET] /roles
  async getListRole(req, res) {
    return await getRoles(req, res);
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



module.exports = new AdminController();
