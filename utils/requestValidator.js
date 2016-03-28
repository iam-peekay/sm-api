const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'requestValidator',
  level: 'debug'
});

function Request() {
  this._currentErrors = {};
  this._archivedErrors = {};
};

Request.prototype.return = function() {
  const errors = this._currentErrors;
  if (Object.keys(errors).length === 0) {
    return Promise.resolve();
  } else {
    for (var key in this._currentErrors) {
      this._archivedErrors[key] = this._currentErrors[key];
    }
    this._currentErrors = {};
    return Promise.reject(errors);
  }
}

Request.prototype.validate = function(valid, error) {
  if (!valid) {
    this._currentErrors[error.type] = error.message;
    log.debug('User input error: ', error);
  }

  // To make this validation function chainable for handling
  // multiple validations on one action, we must return this
  return this;
}

const RequestValidator = new Request();

module.exports = RequestValidator;
