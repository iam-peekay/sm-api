'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

var getVehicleInfo = {};

getVehicleInfo.handleRequest = (req) => {
  return getVehicleInfo._validateRequest(req)
    .then((args) => getVehicleInfo._processRequest(args))
    .then((response) => getVehicleInfo._formatResponse(response));
}

getVehicleInfo._validateRequest = (req) => {
  return Promise.resolve(req);
}

getVehicleInfo._processRequest = (args) => {
  return Promise.resolve(args);
}

getVehicleInfo._formatResponse = (response) => {
  console.log('res', response);
  return { something: 'testing123' };
}

module.exports = getVehicleInfo;
