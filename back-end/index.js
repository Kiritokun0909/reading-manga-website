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
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
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
