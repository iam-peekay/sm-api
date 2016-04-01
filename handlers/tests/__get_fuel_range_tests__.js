const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const getFuelRange = require('./../vehicle/get_fuel_range');
const errorConstants = require('./../../utils/errors/constants');

describe('getFuelRange handler', function() {

  describe('processRequest', function () {

    context('when valid "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: "1234" },
      };

      it('should return an object with "id" as key', function() {
        return getFuelRange._validateRequest(mock_request)
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
        return getFuelRange._validateRequest(mock_request)
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
        return getFuelRange._validateRequest(mock_request)
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

      it('should return an object with "percent" as key and value as a number', function() {
        const shapedResponse = getFuelRange._shapeResponse(mock_response);
        expect(shapedResponse.percent).to.equal(19);
        expect(shapedResponse).to.contain.all.keys(['percent']);
      });
    });

    context('when sent an null or undefined response', function() {
      const mock_response = {
        "service": "getEnergy",
        "status": "200",
        "data": {
          "tankLevel": {
            "type": "Null",
            "value": "null"
          },
          "batteryLevel": {
            "type": "Number",
            "value": "3.14"
          }
        }
      };

      it('should return an object with "percent" as key and value as an error message', function() {
        const shapedResponse = getFuelRange._shapeResponse(mock_response);
        expect(shapedResponse.percent).to.equal(errorConstants.oemResponseError);
        expect(shapedResponse).to.contain.all.keys(['percent']);
      });
    });
  });
});
