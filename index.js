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

// Log server start
log.info('Server has been started');

// Parse json request body into javascript object
app.use(bodyParser.json());

// Enable CORS for routes
app.use(cors());

// Define main API endpoint route
app.use('/vehicles', vehiclesRoute);
require('./routes/vehicles')(vehiclesRoute);

// Start server
const server = app.listen(port, () => {
  log.info('==> Listening on port %s.', port);
});

module.exports = server;
