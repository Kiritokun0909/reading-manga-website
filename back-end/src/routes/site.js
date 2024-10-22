const express = require("express");
const router = express.Router();

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
router.get("/test-api", (req, res) => {
  res.json({ message: "API is working." });
});

module.exports = router;
