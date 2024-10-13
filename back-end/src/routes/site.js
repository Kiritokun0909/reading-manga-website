const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/SiteController.js");

/**
 * @swagger
 * /site/test:
 *   get:
 *     tags: [Site]
 *     summary: Retrieve the home page
 *     description: Returns the homepage content
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

/**
 * @swagger
 * /site/home:
 *   get:
 *     tags: [Site]
 *     summary: Retrieve the home page
 *     description: Returns the homepage content
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/", controller.index);

module.exports = router;
