const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const errorMessages = require('./../../utils/errors/messages');
const getBatteryRange = require('./../vehicle/get_battery_range');

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
                  expect(error).to.contain.all.keys(['Input type', 'Input value'])
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
                  expect(error).to.contain.all.keys(['Input value'])
                });
      });
    });
  });
});
