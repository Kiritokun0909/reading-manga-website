// index.js
const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const route = require('./src/routes/index.js');

require('dotenv').config(); // Load environment variables

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(morgan('combined'));
route(app);

const PORT = process.env.PORT || 4000;
// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WebTruyen API Documentation',
      version: '1.0.0',
      description: 'A simple CRUD API application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // Change this to your server URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your route files (modify as needed)
};

// Initialize Swagger docs
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Set up the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
