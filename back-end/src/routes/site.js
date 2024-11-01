const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /site/test:
 *   get:
 *     tags: [Site]
 *     summary: Test api call
 *     description: Test api call
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/test-api", (req, res) => {
  res.json({ message: "API is working." });
});

module.exports = router;
