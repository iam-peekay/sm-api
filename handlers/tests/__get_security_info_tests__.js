const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const getSecurityInfo = require('./../vehicle/get_security_info');
const errorConstants = require('./../../utils/errors/constants');

describe('getSecurityInfo handler', function() {

  describe('processRequest', function () {

    context('when valid "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: "1234" },
      };

      it('should return an object with "id" as key', function() {
        return getSecurityInfo._validateRequest(mock_request)
                .then(function(response) {
                  expect(response.id).to.equal('1234');
                  expect(response).to.contain.all.keys(['id']);
                });
      });
    });

    context('when invalid (type and value) "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: 1239 },
      };
      it('should throw an error', function() {
        return getSecurityInfo._validateRequest(mock_request)
                .then(function() {
                })
                .catch(function(error) {
                  expect(error).to.exist;
                  expect(error).to.contain.all.keys(['code', 'error', 'message', 'type'])
                });
      });
    });

    context('when invalid (value) "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: "1239" },
      };
      it('should throw an error', function() {
        return getSecurityInfo._validateRequest(mock_request)
                .then(function() {
                })
                .catch(function(error) {
                  expect(error).to.exist;
                  expect(error).to.contain.all.keys(['code', 'error', 'message', 'type'])
                });
      });
    });
  });

  describe('shapeResponse', function () {

    context('when sent a valid/non-nil response', function() {
      const mock_response = {
        "service": "getSecurityStatus",
        "status": "200",
        "data": {
          "doors": {
            "type": "Array",
            "values": [
              {
                "location": {
                  "type": "String",
                  "value": "frontLeft"
                },
                "locked": {
                  "type": "Boolean",
                  "value": "True"
                }
              },
              {
                "location": {
                  "type": "String",
                  "value": "frontRight"
                },
                "locked": {
                  "type": "Boolean",
                  "value": "False"
                }
              }
            ]
          }
        }
      };

      it('should return an array of 2 objects, each of which has keys "location" and "locked" and their associated values', function() {
        const shapedResponse = getSecurityInfo._shapeResponse(mock_response);
        expect(shapedResponse).to.have.lengthOf(2);
        expect(shapedResponse[0].location).to.equal('frontLeft');
        expect(shapedResponse[0].locked).to.equal(true);
        expect(shapedResponse[1].location).to.equal('frontRight');
        expect(shapedResponse[1].locked).to.equal(false);
      });
    });

    context('when sent an null or undefined response', function() {
      const mock_response = {
        "service": "getSecurityStatus",
        "status": "200",
        "data": {
          "doors": {
            "type": "Array",
            "values": [
              {
                "location": {
                  "type": "Null",
                  "value": "null"
                },
                "locked": {
                  "type": "Null",
                  "value": "null"
                }
              },
              {
                "location": {
                  "type": "Null",
                  "value": "null"
                },
                "locked": {
                  "type": "Null",
                  "value": "null"
                }
              }
            ]
          }
        }
      };

      it('should return an array of 2 objects, each of which has keys "location" and "locked" and values as errors', function() {
        const shapedResponse = getSecurityInfo._shapeResponse(mock_response);
        expect(shapedResponse).to.have.lengthOf(2);
        expect(shapedResponse[0].location).to.equal(errorConstants.oemResponseError);
        expect(shapedResponse[0].locked).to.equal(errorConstants.oemResponseError);
        expect(shapedResponse[1].location).to.equal(errorConstants.oemResponseError);
        expect(shapedResponse[1].locked).to.equal(errorConstants.oemResponseError);
      });
    });
  });
});
