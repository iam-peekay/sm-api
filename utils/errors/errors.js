const util = require('util');
const errorConstants = require('./constants');

/*
* We use the Node Error class to build our error class:
* A generic JavaScript Error object that does not denote any specific
* circumstance of why the error occurred. Error objects capture a
* "stack trace" detailing the point in the code at which the Error
*  was instantiated, and may provide a text description of the error.
*/

function ApiError() {}
util.inherits(ApiError, Error);

ApiError.prototype.requestValidationError = function (error) {
  this.type = 'request_validation_error';
  this.code = 400;
  this.error = error;
  this.message = errorConstants.validationError;
  // Without passing ApiError to captureStackTrace, the ApiError
  // frame would go up in the .stack property. By passing
  // the constructor, we omit that frame and all frames above it.
  Error.captureStackTrace(this, ApiError);
};

ApiError.prototype.OemRequestError = function (error) {
  this.type = 'oem_request_error';
  this.code = 500;
  this.error = error;
  this.message = errorConstants.oemRequestError;
  Error.captureStackTrace(this, ApiError);
};

ApiError.prototype.smartcarServerError = function (error) {
  this.type = 'smartcar_server_error';
  this.code = 500;
  this.error = error;
  this.message = errorConstants.smartcarServerError;
  Error.captureStackTrace(this, ApiError);
};

ApiError.prototype.authenticationError = function (error) {
  this.type = 'authentication_error';
  this.code = 401;
  this.error = error;
  this.message = errorConstants.authenticationError;
  Error.captureStackTrace(this, ApiError);
};

const errorClass = new ApiError();

module.exports = errorClass;
