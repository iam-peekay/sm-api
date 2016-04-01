const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const instance = require('./../httpInstance');

describe('Axios http instance', function() {
  context('instance object', function() {
    it('should not be null or undefined', function() {
      expect(instance).to.not.be.null;
      expect(instance).to.not.be.undefined;
    });

    it('should have the correct baseURL', function() {
      expect(instance.defaults.baseURL).to.equal('http://gmapi.azurewebsites.net');
    });

    it('should have the correct headers', function() {
      expect(instance.defaults.headers).to.deep.equal({ 'Content-Type': 'application/json' });
    });

    it('should have a valid timeout', function() {
      expect(instance.defaults.timeout).to.equal(20000);
    });
  });
});
