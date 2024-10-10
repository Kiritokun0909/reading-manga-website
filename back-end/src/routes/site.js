const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/SiteController.js");

/**
 * @swagger
 * /site/test:
 *   get:
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
 *     summary: Retrieve the home page
 *     description: Returns the homepage content
 *     responses:
 *       200:
 *         description: Successful response
 */
router.use("/", controller.index);

module.exports = router;
