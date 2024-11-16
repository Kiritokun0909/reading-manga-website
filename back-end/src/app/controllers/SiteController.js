// src/app/controllers/SiteController.js
const siteService = require("../services/SiteService.js");

class SiteController {
  //#region get-document
  async getDocument(req, res) {
    const { docType } = req.params;
    try {
      const result = await siteService.getDocument(docType);
      res.status(200).json(result);
    } catch (err) {
      console.log("Failed to get document:", err);
      res
        .status(500)
        .json({ message: "Failed to get document. Please try again later." });
    }
  }
}

module.exports = new SiteController();
