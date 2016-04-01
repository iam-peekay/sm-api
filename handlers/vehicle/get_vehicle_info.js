const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorConstants = require('./../../utils/errors/constants');
const log = bunyan.createLogger({
  name: 'handlers/get_vehicle_info',
  level: 'debug',
});

/**
* @description A module that handles getting general vehicle info using vendor connector
* @private
*/

const getVehicleInfo = {};

/**
* @private
* @function Promise returning function that calls methods to validate the
* request, process the request and finally shape the response
* @param {Object} req express.js request object
* @returns {Object} Formatted response
*/

getVehicleInfo._handleRequest = (req, res) => {
  const validateRequest = Promise.method(getVehicleInfo._validateRequest);
  const processRequest = Promise.method(getVehicleInfo._processRequest);
  const shapeResponse = Promise.method(getVehicleInfo._shapeResponse);

  return validateRequest(req, res)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      res.status(error.code).send({ error: error.error, message: error.message });
    });
};

/**
* @private
* @function Promise returning function that validates the request params/body
* @param {Object} req express.js request object
* @returns {Object} an object with Vehicle id
*/

getVehicleInfo._validateRequest = (req) => {
  const id = req.params.id;
  // Object with request parameters validation definitions
  const validationObject = {
    1: {
      valid: _.isString(id),
      param: 'id',
      message: 'Parameter type error: "Id" param must be a string',
    },
    2: {
      valid: (_.isEqual(id, '1234') || _.isEqual(id, '1235')),
      param: 'id',
      message: 'Parameter value error: "Id" param must be either "1234" or "1235"',
    },
  };
  return RequestValidator
          .validate(validationObject)
          .return()
          .then(() => {
            return {
              id,
            };
          });
};

/**
* @private
* @function Promise returning function that processes the request
* @param {Object} an object with Vehicle id
* @returns {Object} Promise returning GM connector method that handles the request
*/

getVehicleInfo._processRequest = (args) => {
  return GMConnector._getVehicleInfo(args);
};

/**
* @private
* @function Shapes the GM response into a Smartcar API formatted response
* @param {Object} response response from GM API
* @returns {Object} an object with shaped response
*/

getVehicleInfo._shapeResponse = (response) => {
  const doorCount = response.data.fourDoorSedan.value === 'True' ? 4 : 2;
  const smartcarResponse = {
    vin: invalidResponse(response.data.vin.value) ? errorConstants.oemResponseError : response.data.vin.value,
    color: invalidResponse(response.data.color.value) ? errorConstants.oemResponseError : response.data.color.value,
    doorCount: invalidResponse(response.data.fourDoorSedan.value) ? errorConstants.oemResponseError : doorCount,
    driveTrain: invalidResponse(response.data.driveTrain.value) ? errorConstants.oemResponseError : response.data.driveTrain.value,
  };
  return smartcarResponse;
};

module.exports = getVehicleInfo;
