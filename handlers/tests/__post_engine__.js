const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const postEngine = require('./../vehicle/post_engine');
const errorMessages = require('./../../utils/errors/messages');

describe('postEngine handler', function() {

  describe('processRequest', function () {

    context('when valid "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: "1234" },
        body: { action: 'sTaRt' },
      };

      it('should return an object with "id" as key', function() {
        return postEngine._validateRequest(mock_request)
                .then(function(response) {
                  expect(response.id).to.equal('1234');
                  expect(response).to.contain.all.keys(['id']);
                });
      });
    });

    context('when invalid (type and value) "id" request paramater is passed in', function() {
      const mock_request = {
        params: { id: 1239 },
        body: { action: 'sTaRt' },
      };
      it('should throw an error', function() {
        return postEngine._validateRequest(mock_request)
                .then(function() {
                })
                .catch(function(error) {
                  expect(error).to.exist;
                  expect(error).to.contain.all.keys(['code', 'error', 'message', 'type'])
                });
      });
    });

    context('when invalid (value) "id" and "action" request paramater is passed in', function() {
      const mock_request = {
        params: { id: "1239" },
        body: { action: 'sTaRtyOoOoOo' },
      };
      it('should throw an error', function() {
        return postEngine._validateRequest(mock_request)
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
        "service": "actionEngine",
        "status": "200",
        "actionResult": {
          "status": "EXECUTED"
        }
      };

      it('should return an object with "status" as key and its associated value', function() {
        const shapedResponse = postEngine._shapeResponse(mock_response);
        expect(shapedResponse.status).to.equal('success');
        expect(shapedResponse).to.contain.all.keys(['status']);
      });
    });

    context('when sent an null or undefined response', function() {
      const mock_response = {
        "service": "actionEngine",
        "status": "200",
        "actionResult": {
          "status": "undefined"
        }
      };

      it('should return an object with "status" as key and  and its associated value as an error message', function() {
        const shapedResponse = postEngine._shapeResponse(mock_response);
        expect(shapedResponse.status).to.equal(errorMessages.oemResponseError);
        expect(shapedResponse).to.contain.all.keys(['status']);
      });
    });
  });
});
