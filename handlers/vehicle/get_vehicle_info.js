const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorMessages = require('./../../utils/errors/messages');
const log = bunyan.createLogger({
  name: 'handlers/get_vehicle_info',
  level: 'debug',
});

const getVehicleInfo = {};

getVehicleInfo._handleRequest = (req) => {
  const validateRequest = Promise.method(getVehicleInfo._validateRequest);
  const processRequest = Promise.method(getVehicleInfo._processRequest);
  const shapeResponse = Promise.method(getVehicleInfo._shapeResponse);

  return validateRequest(req)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      throw new Error(error);
    });
};

getVehicleInfo._validateRequest = (req) => {
  const id = req.params.id;
  return RequestValidator
          .validate(_.isString(id), {
            type: 'Parameter type',
            message: '"Id" param must be a string',
          })
          .validate(_.isEqual(id, '1234') || _.isEqual(id, '1235'), {
            type: 'Parameter value',
            message: '"Id" param must be either "1234" or "1235"',
          })
          .return()
          .then(() => {
            return {
              id,
            };
          });
};

getVehicleInfo._processRequest = (args) => {
  return GMConnector._getVehicleInfo(args);
};

getVehicleInfo._shapeResponse = (response) => {
  const doorCount = response.data.fourDoorSedan.value === 'True' ? 4 : 2;
  const smartcarResponse = {
    vin: invalidResponse(response.data.vin.value) ? errorMessages.oemResponseError : response.data.vin.value,
    color: invalidResponse(response.data.color.value) ? errorMessages.oemResponseError : response.data.color.value,
    doorCount: invalidResponse(response.data.fourDoorSedan.value) ? errorMessages.oemResponseError : doorCount,
    driveTrain: invalidResponse(response.data.driveTrain.value) ? errorMessages.oemResponseError : response.data.driveTrain.value,
  };
  return smartcarResponse;
};

module.exports = getVehicleInfo;
