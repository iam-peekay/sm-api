const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const nock = require('nock');
const GMConnector = require('./../GM_connector');
const nockGetVehicleInfo = require('./nock/nockGetVehicleInfo');
const nockGetSecurityInfo = require('./nock/nockGetVehicleInfo');

describe('GM connector', function() {

  describe('getVehicleInfo', function () {
    var gmScope, gmConnector;

    before(function() {
      gmScope = nock('http://gmapi.azurewebsites.net').persist();
      gmConnector = new GMConnector();
      gmScope
        .post('/getVehicleInfoService', {
          "id": "1234",
          "responseType": "JSON"
        })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, nockGetVehicleInfo.success);

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

    describe('POST /getVehicleInfo', function() {

      context('when correct id and responseType is passed in', function() {
        it('should return 200 response with vehicle info', function() {
          gmConnector._getVehicleInfo({ "id": "1234"})
            .then(function(response) {
              expect(response.status).to.equal('200');
              expect(response.data.vin.value).to.equal('123123412412');
              expect(response.data.color.value).to.equal('Metallic Silver');
              expect(response.data.fourDoorSedan.value).to.equal('True');
              expect(response.data.twoDoorCoupe.value).to.equal('False');
              expect(response.data.driveTrain).to.equal('v8');
            });
        });
      });

      context('when incorrect id is passed in', function() {
        it('should return 404 response with error', function() {
          gmConnector._getVehicleInfo({ "id": "1239"})
            .then(function(response) {
              expect(response.status).to.equal('404');
            });
        });
      });
    });
  });

  describe('getSecurityInfo', function () {
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

    describe('POST /getSecurityStatusService', function() {

      context('when correct id and responseType is passed in', function() {
        it('should return 200 response with security info', function() {
          gmConnector._getVehicleInfo({ "id": "1234"})
            .then(function(response) {
              expect(response.status).to.equal('200');
              expect(response.doors.values.length).to.equal(2);
              expect(response.doors.values[0]).to.have.all.keys('location', 'locked');
              expect(response.doors.values[1]).to.have.all.keys('location', 'locked');
            });
        });
      });

      context('when incorrect id is passed in', function() {
        it('should return 404 response with error', function() {
          gmConnector._getVehicleInfo({ "id": "1239"})
            .then(function(response) {
              expect(response.status).to.equal('404');
            });
        });
      });
    });
  });
});
