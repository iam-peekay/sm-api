const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
const vehiclesRoute = new express.Router();

// Set up logger for server logs. Bunyan formats logs as JSON
const log = bunyan.createLogger({
  name: 'sm-api',
  level: 'debug',
});

// Log start of server
log.info('Server has been started on port %s.', port);

// Parse json request body into javascript object
app.use(bodyParser.json());

// Enable CORS for routes
app.use(cors());

// Define main API endpoint vehicle route
app.use('/vehicles', vehiclesRoute);
require('./routes/vehicles')(vehiclesRoute);

// Start server on defined port
const server = app.listen(port, () => {
  console.info('==> Listening on port %s.', port);
});

// Export used for testing
module.exports = server;
