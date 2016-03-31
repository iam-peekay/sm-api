const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const _ = require('lodash');
const Promise = require('bluebird');
const routeHandler = require('./../routeHandler');
const RequestValidator = require('./../../utils/requestValidator');
const invalidResponse = require('./../../utils/responseValidator');
const errorMessages = require('./../../utils/errors/messages');

describe('rounteHandler', function() {

  describe('valid vehicle handler', function () {
    const mockHandler = {};
    mockHandler._handleRequest = (req) => {
      const validateRequest = Promise.method(mockHandler._validateRequest);
      const processRequest = Promise.method(mockHandler._processRequest);
      const shapeResponse = Promise.method(mockHandler._shapeResponse);

      return validateRequest(req)
        .then((args) => processRequest(args))
        .then((response) => shapeResponse(response))
        .catch((error) => {
          throw new Error(error);
        });
    };

    mockHandler._validateRequest = (req) => {
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

    mockHandler._processRequest = (args) => {
      // mock response
      return {
        "service": "getEnergy",
        "status": "200",
        "data": {
          "tankLevel": {
            "type": "Number",
            "value": "19.52"
          },
          "batteryLevel": {
            "type": "Null",
            "value": "null"
          }
        }
      };
    };

    mockHandler._shapeResponse = (response) => {
      const smartcarResponse = {
        percent: invalidResponse(response.data.tankLevel.value) ? errorMessages.oemResponseError : _.toInteger(response.data.tankLevel.value),
      };
      return smartcarResponse;
    };

    context('when valid (mock) vehicle handler is passed in', function() {
      const mock_request = {
        params: { id: "1234" },
      };
      it('should return an valid smartcar formatted response', function() {
        const mockExpressRes = {
          json: function(val) {
            return val;
          }
        };
        const expectedResult = { percent: 19 };
        routeHandler(mockHandler)(mock_request, mockExpressRes, null)
          .then(function(response) {
            expect(response).to.deep.equal(expectedResult);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    });
  });
});
