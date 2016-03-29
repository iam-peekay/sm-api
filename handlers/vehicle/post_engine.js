const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorMessages = require('./../../utils/errors/messages');
const log = bunyan.createLogger({
  name: 'connectors/GM_connector',
  level: 'debug',
});

const postEngine = {};

postEngine._handleRequest = (req) => {
  const validateRequest = Promise.method(postEngine._validateRequest);
  const processRequest = Promise.method(postEngine._processRequest);
  const shapeResponse = Promise.method(postEngine._shapeResponse);

  return validateRequest(req)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      throw new Error(error);
    });
};

postEngine._validateRequest = (req) => {
  const id = req.params.id;
  const action = req.body.action.toUpperCase();

  return RequestValidator
          .validate(_.isString(id), {
            type: 'Parameter type',
            message: '"Id" param must be a string',
          })
          .validate(_.isEqual(id, '1234') || _.isEqual(id, '1235'), {
            type: 'Parameter value',
            message: '"Id" param must be either "1234" or "1235"',
          })
          .validate(_.isString(action), {
            type: 'Parameter type',
            message: '"Action" value must be a string',
          })
          .validate(_.isEqual(action, 'START') || _.isEqual(action, 'STOP'), {
            type: 'Parameter value',
            message: '"Action" must be either "START" or "STOP"',
          })
          .return()
          .then(() => {
            return {
              id,
              action,
            };
          });
};

postEngine._processRequest = (args) => {
  return GMConnector.postEngine(args);
};

postEngine._shapeResponse = (response) => {
  var status;
  if (invalidResponse(response.actionResult.status)) {
    status =  errorMessages.oemResponseError;
  } else {
    status = response.actionResult.status === 'EXECUTED' ? 'success' : 'error';
  }
  const smartcarResponse = {
    status,
  };
  return smartcarResponse;
};

module.exports = postEngine;
