const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorConstants = require('./../../utils/errors/constants');
const log = bunyan.createLogger({
  name: 'handlers/get_security_info',
  level: 'debug',
});

/**
* @description A module that handles getting security info using vendor connector
* @private
*/

const getSecurityInfo = {};

/**
* @private
* @function Promise returning function that calls methods to validate the
* request, process the request and finally shape the response
* @param {Object} req express.js request object
* @returns {Object} Formatted response
*/

getSecurityInfo._handleRequest = (req, res) => {
  const validateRequest = Promise.method(getSecurityInfo._validateRequest);
  const processRequest = Promise.method(getSecurityInfo._processRequest);
  const shapeResponse = Promise.method(getSecurityInfo._shapeResponse);

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

getSecurityInfo._validateRequest = (req) => {
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

getSecurityInfo._processRequest = (args) => {
  return GMConnector._getSecurityInfo(args);
};

/**
* @private
* @function Shapes the GM response into a Smartcar API formatted response
* @param {Object} response response from GM API
* @returns {Object} an object with shaped response
*/

getSecurityInfo._shapeResponse = (response) => {
  const smartcarResponse = [];

  _.forEach(response.data.doors.values, (value) => {
    smartcarResponse.push({
      location: invalidResponse(value.location.value) ? errorConstants.oemResponseError : value.location.value,
      locked: invalidResponse(value.locked.value) ? errorConstants.oemResponseError : (value.locked.value === 'True'),
    });
  });

  return smartcarResponse;
};

module.exports = getSecurityInfo;
