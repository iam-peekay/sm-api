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

const getBatteryRange = {};

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

getBatteryRange._validateRequest = (req) => {
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

getBatteryRange._processRequest = (args) => {
  return GMConnector.getBatteryRange(args);
};

getBatteryRange._shapeResponse = (response) => {
  const smartcarResponse = {
    percent: invalidResponse(response.data.batteryLevel.value) ? errorMessages.oemResponseError : _.toInteger(response.data.batteryLevel.value),
  };
  return smartcarResponse;
};

module.exports = getBatteryRange;
