// src/app/controllers/AdminController.js

const roleService = require("../services/RoleService.js");
const userService = require("../services/UserService.js");
const siteService = require("../services/SiteService.js");
const HandleCode = require("../../utilities/HandleCode.js");

class AdminController {
  //#region get-roles
  async getListRole(req, res) {
    try {
      const result = await roleService.getRoles();
      res.status(200).json(result.roles);
    } catch (err) {
      console.log("Failed to get list roles:", err);
      res
        .status(500)
        .json({ message: "Failed to get list roles. Please try again later." });
    }
  }
  //#endregion

  //#region ban-user
  async banUser(req, res) {
    const currentUser = req.user.id;
    const { userId } = req.params;
    const { status } = req.body;
    try {
      if (currentUser == userId) {
        return res.status(400).json({ message: "You cannot ban yourself." });
      }

      const result = await userService.setUserBanStatus(userId, status);
      if (result && result.code == HandleCode.NOT_FOUND) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ message: "Ban/Unban user successfully." });
    } catch (err) {
      console.log("Failed to ban/unban user:", err);
      res
        .status(500)
        .json({ message: "Failed to ban/unban user. Please try again later." });
    }
  }
  //#endregion

  //#region get-users
  async getListUser(req, res) {
    const { pageNumber, itemsPerPage, status, role, keyword } = req.query;
    try {
      const result = await userService.getListUser(
        parseInt(pageNumber),
        parseInt(itemsPerPage),
        status,
        role,
        keyword
      );

      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get list users:", err);
      res
        .status(500)
        .json({ message: "Failed to get list users. Please try again later." });
    }
  }
  //#endregion

  //#region update-document
  async updateDocument(req, res) {
    const { docType } = req.params;
    const { content } = req.body;
    try {
      const result = await siteService.updateDocument(docType, content);

      res.status(200).json({ message: "Update document successfully." });
    } catch (err) {
      console.log("Failed to update document:", err);
      res.status(500).json({
        message: "Failed to update document. Please try again later.",
      });
    }
  }
  //#endregion
}

module.exports = new AdminController();
