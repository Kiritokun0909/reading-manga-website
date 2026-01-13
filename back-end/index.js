const express = require('express');
const cors = require('cors');

const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const route = require('./src/routes/index.js');

require('dotenv').config(); // Load environment variables

// Middleware for parsing JSON
const cookieParser = require('cookie-parser');

// ...
app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser
app.use(morgan('combined'));

// Allow requests from frontend with credentials
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow frontend origin. Update this if frontend runs on different port
    // origin: '*', // Allow frontend origin. Update this if frontend runs on different port
    credentials: true, // Allow cookies to be sent
  })
);

route(app);

const PORT = process.env.PORT || 3000;

// Bind the server to 0.0.0.0:5000
const HOST = '0.0.0.0';

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`App listening at http://${HOST}:${PORT}`);
});
