const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorConstants = require('./../../utils/errors/constants');
const ErrorClass = require('./../../utils/errors/errors');
const log = bunyan.createLogger({
  name: 'handlers/post_engine',
  level: 'debug',
});

/**
* @description A module that handles posting engine action (START|STOP) using vendor connector
* @private
*/

const postEngine = {};

/**
* @private
* @function Promise returning function that calls methods to validate the
* request, process the request and finally shape the response
* @param {Object} req express.js request object
* @returns {Object} Formatted response
*/

postEngine._handleRequest = (req, res) => {
  const validateRequest = Promise.method(postEngine._validateRequest);
  const processRequest = Promise.method(postEngine._processRequest);
  const shapeResponse = Promise.method(postEngine._shapeResponse);

  return validateRequest(req, res)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      res.status(error.code).send({ error: error.error, message: error.message });
      // throw new Error(error);
    });
};

/**
* @private
* @function Promise returning function that validates the request params/body
* @param {Object} req express.js request object
* @returns {Object} an object with Vehicle id and type of engine action (START|STOP)
*/

postEngine._validateRequest = (req) => {
  if (!req.body.action) {
    const error = new ErrorClass.requestValidationError('Missing "action" request body parameter.');
    log.warn('User input error: ', error);
    throw error;
  }

  const id = req.params.id;
  const action = req.body.action.toUpperCase();

  return RequestValidator
          .validate(_.isString(id), {
            param: 'id',
            message: 'Parameter type error: "Id" param must be a string',
          })
          .validate(_.isEqual(id, '1234') || _.isEqual(id, '1235'), {
            param: 'id',
            message: 'Parameter value error: "Id" param must be either "1234" or "1235"',
          })
          .validate(_.isString(action), {
            param: 'action',
            message: 'Request body type error: "Action" value must be a string',
          })
          .validate(_.isEqual(action, 'START') || _.isEqual(action, 'STOP'), {
            param: 'action',
            message: 'Request body value error: "Action" must be either "START" or "STOP"',
          })
          .return()
          .then(() => {
            return {
              id,
              action,
            };
          });
};

/**
* @private
* @function Promise returning function that processes the request
* @param {Object} an object with Vehicle id
* @returns {Object} Promise returning GM connector method that handles the request
*/

postEngine._processRequest = (args) => {
  // NOTE: in a real-life scenario when there are more vendor adapters, we'd
  // use the connectors object to get the right connector based on the vendor
  // name stored on req object. Here I just hardcoded GM connector for
  // simplicity's sake.
  return GMConnector._postEngine(args);
};

/**
* @private
* @function Shapes the GM response into a Smartcar API formatted response
* @param {Object} response response from GM API
* @returns {Object} an object with shaped response
*/

postEngine._shapeResponse = (response) => {
  var status;
  if (invalidResponse(response.actionResult.status)) {
    status = errorConstants.oemResponseError;
  } else {
    status = response.actionResult.status === 'EXECUTED' ? 'success' : 'error';
  }
  const smartcarResponse = {
    status,
  };
  return smartcarResponse;
};

module.exports = postEngine;
