const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const requestValidator = require('./../requestValidator');
const errorMessages = require('./../../utils/errors/messages');

describe('requestValidator', function() {
  context('when valid input is passed in', function() {
    const input = (typeof '1234' === 'string');
    const error = {
      type: 'Parameter type',
      message: '"Id" param must be a string',
    };
    it('should resolve Promise without any errors', function() {
      return requestValidator.validate(input, error)
              .return()
              .then(function(response) {
                expect(response).to.be.undefined;
              });
    });
  });

  context('when invalid input type is passed in', function() {
    const input = (typeof 1234 === 'string');
    const error = {
      type: 'Parameter type',
      message: '"Id" param must be a string',
    };
    const expectedErrorResponse = {
      'code': 400,
      'error': {
        'Parameter type': '"Id" param must be a string',
      },
      'message':  'Invalid or missing request parameters. Please check API docs for details on request parameters.',
      'type': 'request_validation_error',
    };
    it('should reject Promise with all errors', function() {
      return requestValidator.validate(input, error)
              .return()
              .then(function() {
              })
              .catch(function(error) {
                expect(error).to.exist;
                expect(error).to.deep.equal(expectedErrorResponse);
              });
    });
  });
});
