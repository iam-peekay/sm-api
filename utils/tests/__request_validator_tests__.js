const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const requestValidator = require('./../requestValidator');

describe('requestValidator', function() {
  context('when valid input is passed in to validate method', function() {
    const validationObject = {
      1: {
        valid: _.isString('1234'),
        param: 'id',
        message: 'Parameter type error: "Id" param must be a string',
      },
      2: {
        valid: (_.isEqual('1234', '1234') || _.isEqual('1234', '1235')),
        param: 'id',
        message:  'Parameter value error: "Id" param must be either "1234" or "1235"',
      },
    };
    it('should resolve Promise without any errors', function() {
      return requestValidator.validate(validationObject)
              .return()
              .then(function(response) {
                expect(response).to.be.undefined;
              });
    });
  });

  context('when invalid input type is passed in to validate method', function() {
    const validationObject = {
      1: {
        valid: _.isString(1234),
        param: 'id',
        message: 'Parameter type error: "Id" param must be a string',
      },
      2: {
        valid: (_.isEqual(1234, '1234') || _.isEqual(1234, '1235')),
        param: 'id',
        message:  'Parameter value error: "Id" param must be either "1234" or "1235"',
      },
    };
    const expectedErrorResponse = {
      'code': 400,
      'error': {
        'id': ['Parameter type error: "Id" param must be a string', 'Parameter value error: "Id" param must be either "1234" or "1235"'],
      },
      'message':  'Invalid or missing request parameters. Please check API docs for details on request parameters.',
      'type': 'request_validation_error',
    };
    it('should reject Promise with all errors', function() {
      return requestValidator.validate(validationObject)
              .return()
              .then(function() {
              })
              .catch(function(error) {
                expect(error).to.exist;
                expect(error).to.deep.equal(expectedErrorResponse);
              });
    });
  });

  context('when validate method is called with 2 errors', function() {
    const validationObject = {
      1: {
        valid: _.isString(1234),
        param: 'id',
        message: 'Parameter type error: "Id" param must be a string',
      },
      2: {
        valid: (_.isEqual(1234, '1234') || _.isEqual(1234, '1235')),
        param: 'id',
        message:  'Parameter value error: "Id" param must be either "1234" or "1235"',
      },
    };
    it('getArchivedErrors method should return 2 archived errors', function() {
      requestValidator.validate(validationObject)
        .return()
        .then(function(response) {

        })
        .catch(function(error) {
          expect(requestValidator.getArchivedErrors().id).to.have.lengthOf(2);
        });
    });
  });
});
