const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const nock = require('nock');
const GMConnector = require('./../GM_connector');
const nockGetVehicleInfo = require('./nock/nockGetVehicleInfo');
const nockGetSecurityInfo = require('./nock/nockGetSecurityInfo');
const nockGetEnergyService = require('./nock/nockGetEnergyService');
const nockActionEngineService = require('./nock/nockActionEngineService');
const errorMessages = require('./../../utils/errors/messages');

describe('GM connector', function() {

  describe('POST /getVehicleInfo - success', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net');
      gmConnector = new GMConnector();
      gmScope
        .post('/getVehicleInfoService', {
          "id": "1234",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, nockGetVehicleInfo.success);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when correct id and responseType is passed in', function() {
      it('should return 200 response with vehicle info', function() {
        return gmConnector._getVehicleInfo({ "id": "1234"})
                .then(function(response) {
                  expect(response.status).to.equal('200');
                  expect(response.data.vin.value).to.equal('123123412412');
                  expect(response.data.color.value).to.equal('Metallic Silver');
                  expect(response.data.fourDoorSedan.value).to.equal('True');
                  expect(response.data.twoDoorCoupe.value).to.equal('False');
                  expect(response.data.driveTrain.value).to.equal('v8');
                });
      });
    });
  });

  describe('POST /getVehicleInfo - error', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net');
      gmConnector = new GMConnector();
      gmScope
        .post('/getVehicleInfoService', {
          "id": "1239",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(404, nockGetVehicleInfo.error);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when incorrect id is passed in', function() {
      it('should return 404 response', function() {
        return gmConnector._getVehicleInfo({ "id": "1239"})
                .then(function() {
                })
                .catch(function(error) {
                  expect(error.error.status).to.equal(404);
                  expect(error.message).to.equal(errorMessages.oemRequestError);
                });
      });
    });
  });

  describe('POST /getSecurityStatusService - success', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net').persist();
      gmConnector = new GMConnector();
      gmScope
        .post('/getSecurityStatusService', {
          "id": "1234",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, nockGetSecurityInfo.success);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when correct id and responseType is passed in', function() {
      it('should return 200 response with security info', function() {
        return gmConnector._getSecurityInfo({ "id": "1234"})
                .then(function(response) {
                  expect(response.status).to.equal('200');
                  expect(response.data.doors.values.length).to.equal(2);
                  expect(response.data.doors.values[0]).to.have.all.keys('location', 'locked');
                  expect(response.data.doors.values[1]).to.have.all.keys('location', 'locked');
                });
      });
    });
  });

  describe('POST /getSecurityStatusService - error', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net');
      gmConnector = new GMConnector();
      gmScope
        .post('/getSecurityStatusService', {
          "id": "1239",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(404, nockGetSecurityInfo.error);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when incorrect id is passed in', function() {
      it('should return 404 response', function() {
        return gmConnector._getSecurityInfo({ "id": "1239"})
                .then(function() {
                })
                .catch(function(error) {
                  expect(error.error.status).to.equal(404);
                  expect(error.message).to.equal(errorMessages.oemRequestError);
                });
      });
    });
  });

  describe('POST /getEnergyService (fuel) - success', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net').persist();
      gmConnector = new GMConnector();
      gmScope
        .post('/getEnergyService', {
          "id": "1234",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, nockGetEnergyService.success);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when correct id and responseType is passed in', function() {
      it('should return 200 response with fuel/battery info', function() {
        return gmConnector._getFuelRange({ "id": "1234"})
                .then(function(response) {
                  expect(response.status).to.equal('200');
                  expect(response.data.tankLevel.value).to.equal("64.94");
                });
      });
    });
  });

  describe('POST /getEnergyService (fuel) - error', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net');
      gmConnector = new GMConnector();
      gmScope
        .post('/getEnergyService', {
          "id": "1239",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(404, nockGetEnergyService.error);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when incorrect id is passed in', function() {
      it('should return 404 response', function() {
        return gmConnector._getSecurityInfo({ "id": "1239"})
                .then(function() {
                })
                .catch(function(error) {
                  expect(error.error.status).to.equal(404);
                  expect(error.message).to.equal(errorMessages.oemRequestError);
                });
      });
    });
  });

  describe('POST /getEnergyService (battery) - success', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net').persist();
      gmConnector = new GMConnector();
      gmScope
        .post('/getEnergyService', {
          "id": "1234",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, nockGetEnergyService.success);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when correct id and responseType is passed in', function() {
      it('should return 200 response with fuel/battery info', function() {
        return gmConnector._getBatteryRange({ "id": "1234"})
                .then(function(response) {
                  expect(response.status).to.equal('200');
                  expect(response.data.batteryLevel.value).to.equal("null");
                });
      });
    });
  });

  describe('POST /getEnergyService (battery) - error', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net');
      gmConnector = new GMConnector();
      gmScope
        .post('/getEnergyService', {
          "id": "1239",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(404, nockGetEnergyService.error);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when incorrect id is passed in', function() {
      it('should return 404 response', function() {
        return gmConnector._getBatteryRange({ "id": "1239"})
                .then(function() {
                })
                .catch(function(error) {
                  expect(error.error.status).to.equal(404);
                  expect(error.message).to.equal(errorMessages.oemRequestError);
                });
      });
    });
  });

  describe('POST /actionEngineService - success', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net').persist();
      gmConnector = new GMConnector();
      gmScope
        .post('/actionEngineService', {
          "id": "1234",
          "command": "START_VEHICLE",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, nockActionEngineService.success);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when correct id and responseType is passed in', function() {
      it('should return 200 response with fuel/battery info', function() {
        return gmConnector._postEngine({ "id": "1234", "action": "START" })
                .then(function(response) {
                  expect(response.status).to.equal('200');
                  expect(response.actionResult.status).to.equal("EXECUTED");
                });
      });
    });
  });

  describe('POST /actionEngineService - error', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net');
      gmConnector = new GMConnector();
      gmScope
        .post('/actionEngineService', {
          "id": "1239",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(404, nockActionEngineService.error);
    });

    after(function() {
      nock.cleanAll();
    });

    context('when incorrect id is passed in', function() {
      it('should return 404 response', function() {
        return gmConnector._postEngine({ "id": "1239", "command": "START"})
                .then(function() {
                })
                .catch(function(error) {
                  expect(error.error.status).to.equal(404);
                  expect(error.message).to.equal(errorMessages.oemRequestError);
                });
      });
    });
  });
});
