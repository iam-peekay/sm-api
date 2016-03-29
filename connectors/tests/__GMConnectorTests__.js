const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const nock = require('nock');
const GMConnector = require('./../GM_connector');
const nockGetVehicleInfo = require('./nock/nockGetVehicleInfo');

describe('GM connector', function() {
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

  describe('/getVehicleInfo', function() {

    context('when correct id and responseType is passed in', function() {
      it('should return 200 response with data', function() {
        gmConnector._getVehicleInfo({ "id": "1234"})
          .then(function(response) {
            expect(response).to.equal(nockGetVehicleInfo.success);
          });
        });
      });

    context('when incorrect id is passed in', function() {
      it('should return 404 response with error', function() {
        gmConnector._getVehicleInfo({ "id": "1239"})
          .then(function(response) {
            expect(response).to.equal(nockGetVehicleInfo.error);
          });
        });
      });

    });

  });
