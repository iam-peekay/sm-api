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

const getFuelRange = {};

getFuelRange._handleRequest = (req) => {
  const validateRequest = Promise.method(getFuelRange._validateRequest);
  const processRequest = Promise.method(getFuelRange._processRequest);
  const shapeResponse = Promise.method(getFuelRange._shapeResponse);

  return validateRequest(req)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      throw new Error(error);
    });
};

getFuelRange._validateRequest = (req) => {
  const id = req.params.id;
  return RequestValidator
          .validate(_.isString(id), {
            type: 'Input type',
            message: '"Id" param must be a string',
          })
          .validate(_.isEqual(id, '1234') || _.isEqual(id, '1235'), {
            type: 'Input value',
            message: '"Id" param must be either "1234" or "1235"',
          })
          .return()
          .then(() => {
            return {
              id,
            };
          });
};

getFuelRange._processRequest = (args) => {
  return GMConnector._getFuelRange(args);
};

getFuelRange._shapeResponse = (response) => {
  const smartcarResponse = {
    percent: invalidResponse(response.data.tankLevel.value) ? errorMessages.oemResponseError : _.toInteger(response.data.tankLevel.value),
  };
  return smartcarResponse;
};

module.exports = getFuelRange;
