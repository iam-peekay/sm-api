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
  });
});
