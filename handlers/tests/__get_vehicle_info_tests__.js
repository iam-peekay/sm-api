const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const getVehicleInfo = require('./../vehicle/get_vehicle_info');
const errorMessages = require('./../../utils/errors/messages');

describe('getVehicleInfo handler', function() {

  describe('processRequest', function () {

    context('when valid "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: "1234" },
      };

      it('should return an object with "id" as key', function() {
        return getVehicleInfo._validateRequest(mock_request)
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
        return getVehicleInfo._validateRequest(mock_request)
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
        return getVehicleInfo._validateRequest(mock_request)
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
        "service": "getVehicleInfo",
        "status": "200",
        "data": {
          "vin": {
            "type": "String",
            "value": "123123412412"
          },
          "color": {
            "type": "String",
            "value": "Metallic Silver"
          },
          "fourDoorSedan": {
            "type": "Boolean",
            "value": "True"
          },
          "twoDoorCoupe": {
            "type": "Boolean",
            "value": "False"
          },
          "driveTrain": {
            "type": "String",
            "value": "v8"
          }
        }
      };

      it('should return an object with "vin", "color", "doorCount", "driveTrain" as keys and their associated values', function() {
        const shapedResponse = getVehicleInfo._shapeResponse(mock_response);
        expect(shapedResponse.vin).to.equal('123123412412');
        expect(shapedResponse.color).to.equal('Metallic Silver');
        expect(shapedResponse.doorCount).to.equal(4);
        expect(shapedResponse.driveTrain).to.equal('v8');
        expect(shapedResponse).to.contain.all.keys(['vin', 'color', 'doorCount', 'driveTrain']);
      });
    });

    context('when sent an null or undefined response', function() {
      const mock_response = {
        "service": "getVehicleInfo",
        "status": "200",
        "data": {
          "vin": {
            "type": "String",
            "value": "null"
          },
          "color": {
            "type": "String",
            "value": "null"
          },
          "fourDoorSedan": {
            "type": "Boolean",
            "value": "null"
          },
          "twoDoorCoupe": {
            "type": "Boolean",
            "value": "null"
          },
          "driveTrain": {
            "type": "String",
            "value": "null"
          }
        }
      };

      it('should return an object with "vin", "color", "doorCount", "driveTrain" as keys and their associated values as an error message', function() {
        const shapedResponse = getVehicleInfo._shapeResponse(mock_response);
        expect(shapedResponse.vin).to.equal(errorMessages.oemResponseError);
        expect(shapedResponse.color).to.equal(errorMessages.oemResponseError);
        expect(shapedResponse.doorCount).to.equal(errorMessages.oemResponseError);
        expect(shapedResponse.driveTrain).to.equal(errorMessages.oemResponseError);
        expect(shapedResponse).to.contain.all.keys(['vin', 'color', 'doorCount', 'driveTrain']);
      });
    });
  });
});
