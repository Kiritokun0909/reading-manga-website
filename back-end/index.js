const express = require("express");
const cors = require("cors");

const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const route = require("./src/routes/index.js");

require("dotenv").config(); // Load environment variables

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(morgan("combined"));

// Allow all requests from anywhere
app.use(
  cors({
    origin: "*",
  })
);

route(app);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
