const express = require("express");
const SiteController = require("../app/controllers/SiteController");
const router = express.Router();

router.get("/test-api", (req, res) => {
  res.json({ message: "API is working." });
});

router.get("/document/:docType", SiteController.getDocument);

module.exports = router;
