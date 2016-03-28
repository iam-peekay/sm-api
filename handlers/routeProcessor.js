'use strict';

const Promise = require('bluebird');

const routeProcessor = (vehicleHandler) => {
  return (req, res, next) => {
    var handleRequest = Promise.method(vehicleHandler.handleRequest);

    // Validate request
    handleRequest(req)
      .then((response) => {
      // Send response as JSON
        res.json(response);
      }).catch((error) => {
        next(error);
      });
  }
}

module.exports = routeProcessor;
