'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');


var getVehicleInfo = {};

getVehicleInfo._handleRequest = (req) => {
  var validateRequest = Promise.method(getVehicleInfo._validateRequest);
  var processRequest = Promise.method(getVehicleInfo._processRequest);
  var shapeResponse = Promise.method(getVehicleInfo._shapeResponse);

  return validateRequest(req)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      console.log(error.stack, 'ERROR');
      throw new Error(error.stack); // TODO: build error handlers
    });
}

getVehicleInfo._validateRequest = (req) => {
  const id = req.params.id;
  return RequestValidator
          .validate(_.isString(id), {
            type: 'Input type',
            message: 'Id param must be a string'
          })
          .validate(_.isEqual(id, '1234') || _.isEqual(id, '1235'), {
            type: 'Input value',
            message: 'Id param must be either 1234 or 1235'
          })
          .return()
          .then(() => {
            return {
              id: id,
            }
          });
}

getVehicleInfo._processRequest = (args) => {
  return GMConnector.getVehicleInfo(args);
}

getVehicleInfo._shapeResponse = (response) => {
  const doorCount = response.data.fourDoorSedan.value === 'True' ? 4 : 2;
  const smartcarResponse = {
    vin: response.data.vin.value,
    color: response.data.color.value,
    doorCount: doorCount,
    driveTrain: response.data.driveTrain.value,
  };
  return smartcarResponse;
}

module.exports = getVehicleInfo;
