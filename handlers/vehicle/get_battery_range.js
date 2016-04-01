const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorMessages = require('./../../utils/errors/messages');
const log = bunyan.createLogger({
  name: 'handlers/get_battery_range',
  level: 'debug',
});

/**
* @description A module that handles getting battery range using vendor connector
* @private
*/

const getBatteryRange = {};

/**
* @private
* @function Promise returning function that calls methods to validate the
* request, process the request and finally shape the response
* @param {Object} req express.js request object
* @returns {Object} Formatted response
*/

getBatteryRange._handleRequest = (req) => {
  const validateRequest = Promise.method(getBatteryRange._validateRequest);
  const processRequest = Promise.method(getBatteryRange._processRequest);
  const shapeResponse = Promise.method(getBatteryRange._shapeResponse);

  return validateRequest(req)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      throw new Error(error);
    });
};

/**
* @private
* @function Promise returning function that validates the request params/body
* @param {Object} req express.js request object
* @returns {Object} an object with Vehicle id
*/

getBatteryRange._validateRequest = (req) => {
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

/**
* @private
* @function Promise returning function that processes the request
* @param {Object} an object with Vehicle id
* @returns {Object} Promise returning GM connector method that handles the request
*/

getBatteryRange._processRequest = (args) => {
  return GMConnector._getBatteryRange(args);
};

/**
* @private
* @function Shapes the GM response into a Smartcar API formatted response
* @param {Object} response response from GM API
* @returns {Object} an object with shaped response
*/

getBatteryRange._shapeResponse = (response) => {
  const smartcarResponse = {
    percent: invalidResponse(response.data.batteryLevel.value) ? errorMessages.oemResponseError : _.toInteger(response.data.batteryLevel.value),
  };
  return smartcarResponse;
};

module.exports = getBatteryRange;
