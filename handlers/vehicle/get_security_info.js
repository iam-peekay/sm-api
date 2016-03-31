const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const connectors = require('./../../connectors/');
const GMConnector = connectors.getConnector('GM');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorMessages = require('./../../utils/errors/messages');
const log = bunyan.createLogger({
  name: 'handlers/get_security_info',
  level: 'debug',
});

const getSecurityInfo = {};

getSecurityInfo._handleRequest = (req) => {
  const validateRequest = Promise.method(getSecurityInfo._validateRequest);
  const processRequest = Promise.method(getSecurityInfo._processRequest);
  const shapeResponse = Promise.method(getSecurityInfo._shapeResponse);

  return validateRequest(req)
    .then((args) => processRequest(args))
    .then((response) => shapeResponse(response))
    .catch((error) => {
      log.info('Error processing user request: ', error);
      throw new Error(error);
    });
};

getSecurityInfo._validateRequest = (req) => {
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

getSecurityInfo._processRequest = (args) => {
  return GMConnector._getSecurityInfo(args);
};

getSecurityInfo._shapeResponse = (response) => {
  const smartcarResponse = [];

  _.forEach(response.data.doors.values, (value, key) => {
    smartcarResponse.push({
      location: invalidResponse(value.location.value) ? errorMessages.oemResponseError : value.location.value,
      locked: invalidResponse(value.locked.value) ? errorMessages.oemResponseError : (value.locked.value === 'True'),
    });
  });

  return smartcarResponse;
};

module.exports = getSecurityInfo;
