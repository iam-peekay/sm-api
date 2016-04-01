const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorConstants = require('./../../utils/errors/constants');
const log = bunyan.createLogger({
  name: 'handlers/get_fuel_range',
  level: 'debug',
});

/**
* @description A module that handles getting fuel range using vendor connector
* @private
*/

const getFuelRange = {};

/**
* @private
* @function Promise returning function that calls methods to validate the
* request, process the request and finally shape the response
* @param {Object} req express.js request object
* @returns {Object} Formatted response
*/

getFuelRange._handleRequest = (req, res) => {
  const validateRequest = Promise.method(getFuelRange._validateRequest);
  const processRequest = Promise.method(getFuelRange._processRequest);
  const shapeResponse = Promise.method(getFuelRange._shapeResponse);

  return validateRequest(req, res)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      res.status(error.code).send({ error: error.message });
      // throw new Error({ message: error });
    });
};

/**
* @private
* @function Promise returning function that validates the request params/body
* @param {Object} req express.js request object
* @returns {Object} an object with Vehicle id
*/

getFuelRange._validateRequest = (req, res) => {
  const id = req.params.id;
  return RequestValidator
          .validate(_.isString(id), {
            message: 'Parameter type error: "Id" param must be a string',
          })
          .validate(_.isEqual(id, '1234') || _.isEqual(id, '1235'), {
            message: 'Parameter value error: "Id" param must be either "1234" or "1235"',
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

getFuelRange._processRequest = (args) => {
  return GMConnector._getFuelRange(args);
};

/**
* @private
* @function Shapes the GM response into a Smartcar API formatted response
* @param {Object} response response from GM API
* @returns {Object} an object with shaped response
*/

getFuelRange._shapeResponse = (response) => {
  const smartcarResponse = {
    percent: invalidResponse(response.data.tankLevel.value) ? errorConstants.oemResponseError : _.toInteger(response.data.tankLevel.value),
  };
  return smartcarResponse;
};

module.exports = getFuelRange;
