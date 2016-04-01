const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const getBatteryRange = require('./../vehicle/get_battery_range');
const errorMessages = require('./../../utils/errors/messages');

describe('getBatteryRange handler', function() {

  describe('processRequest', function () {

    context('when valid "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: "1234" },
      };

      it('should return an object with "id" as key', function() {
        return getBatteryRange._validateRequest(mock_request)
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
        return getBatteryRange._validateRequest(mock_request)
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
        return getBatteryRange._validateRequest(mock_request)
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
            "type": "Null",
            "value": "null"
          },
          "batteryLevel": {
            "type": "Number",
            "value": "3.14"
          }
        }
      };

      it('should return an object with "percent" as key and value as a number', function() {
        const shapedResponse = getBatteryRange._shapeResponse(mock_response);
        expect(shapedResponse.percent).to.equal(3);
        expect(shapedResponse).to.contain.all.keys(['percent']);
      });
    });

    context('when sent an null or undefined response', function() {
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

      it('should return an object with "percent" as key and value as an error message', function() {
        const shapedResponse = getBatteryRange._shapeResponse(mock_response);
        expect(shapedResponse.percent).to.equal(errorMessages.oemResponseError);
        expect(shapedResponse).to.contain.all.keys(['percent']);
      });
    });
  });
});
