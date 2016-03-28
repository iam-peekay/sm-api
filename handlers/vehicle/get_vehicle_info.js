'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');

var getVehicleInfo = {};

getVehicleInfo.handleRequest = (req) => {
  var validateRequest = Promise.method(getVehicleInfo._validateRequest);
  var processRequest = Promise.method(getVehicleInfo._processRequest);
  var formatRequest = Promise.method(getVehicleInfo._formatResponse);

  return validateRequest(req)
    .then((args) => processRequest(args))
    .then((response) => formatRequest(response))
    .catch((error) => console.log(error, 'ERROR')); // TODO: build error handlers
}

getVehicleInfo._validateRequest = (req) => {
  return req.params;
}

getVehicleInfo._processRequest = (args) => {
  return GMConnector.getVehicleInfo(1234);
}

getVehicleInfo._formatResponse = (response) => {
  return { testing: response };
}

module.exports = getVehicleInfo;
