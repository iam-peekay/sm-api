const Promise = require('bluebird');
const ErrorClass = require('./errors/errors');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'requestValidator',
  level: 'debug',
});

/**
* @description A module that handles validating user requests. It keeps track
* of current errors (for the request in progress) and archived errors (for
* errors in previous requests). The archived errors serve as an additional
* source of logs.
* @private
*/

function Request() {
  this._currentErrors = {};
  this._archivedErrors = {};
}

/**
* @private
* @function Adds errors to current errors object if input is not valid
* @param {Boolean} valid Status whether input is valid or not
* @param {Object} error Error object to use if input is invalid
* @returns {Object} this
*/

Request.prototype.validate = function (validationObject) {
  // for each key in validation object
  var key;
  var current;
  for (key in validationObject) {
    current = validationObject[key];
    // check if the validation fails
    if (current.valid === false) {
      // add the current validation error message to list of current errors
      if (!this._currentErrors[current.param]) {
        this._currentErrors[current.param] = [current.message];
      } else {
        this._currentErrors[current.param].push(current.message);
      }
      log.info('User input error: ', current.message);
    }
  }
  // To make this validation function chainable, return this
  return this;
};

/**
* @private
* @function Checks if the current request had any validation errors. If yes,
* rejects the Promise. Otherwise, resolves the Promise.
* @returns {Object} Promise
*/

Request.prototype.return = function () {
  // Save current API call's errors in a variable
  const errors = this._currentErrors;
  // If no errors from current API call, resolve Promise
  if (Object.keys(errors).length === 0) {
    return Promise.resolve();
  } else {
    // Else, copy over the current errors to archived errors
    for (const key in this._currentErrors) {
      if (!this._archivedErrors[key]) {
        this._archivedErrors[key] = this._currentErrors[key];
      }
    }
    // Reset the current API call errors object
    this._currentErrors = {};
    // Reject promise with the errors from current API call
    return Promise.reject(new ErrorClass.requestValidationError(errors));
  }
};

Request.prototype.getArchivedErrors = function () {
  if (Object.keys(this._archivedErrors).length > 0) {
    return this._archivedErrors;
  }
  return 'No errors';
};

const RequestValidator = new Request();

module.exports = RequestValidator;
