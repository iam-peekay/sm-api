const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const connectors = require('./../index');

describe('Connectors object', function() {
  context('GM connector', function() {
    it('should not be null or undefined', function() {
      expect(connectors.GM).to.not.be.null;
      expect(connectors.GM).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(connectors.GM).to.be.instanceof(Function);
    });
  });

  context('getConnector method', function() {
    it('should return an instance of GM connector', function() {
      expect(connectors.getConnector('GM')).to.be.instanceof(connectors.GM);
    });
  });
});
