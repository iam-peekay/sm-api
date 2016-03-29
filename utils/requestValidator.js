const Promise = require('bluebird');
const errorClass = require('./errors/errors');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'requestValidator',
  level: 'debug',
});

function Request() {
  this._currentErrors = {};
  this._archivedErrors = {};
}

Request.prototype.return = function () {
  // Save current API call errors in a variable
  const errors = this._currentErrors;
  // If no errors from current API call, resolve Promise
  if (Object.keys(errors).length === 0) {
    return Promise.resolve();
  } else {
    // Else, copy over the errors to archived errors
    for (const key in this._currentErrors) {
      if (!this._archivedErrors[key]) {
        this._archivedErrors[key] = this._currentErrors[key];
      }
    }
    // Reset the current API call errors object
    this._currentErrors = {};
    // Reject promise with the errors from current API call
    return Promise.reject(errors);
  }
};

Request.prototype.validate = function (valid, error) {
  // If request isn't validated, append the error to current API
  //  call's error object
  if (!valid) {
    this._currentErrors[error.type] = error.message;
    log.debug('User input error: ', error);
    throw new errorClass.requestValidationError(error);
  }
  // To make this validation function chainable for handling
  // multiple validations on one action, we must return this
  return this;
};

const RequestValidator = new Request();

module.exports = RequestValidator;
