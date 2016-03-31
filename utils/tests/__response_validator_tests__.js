const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const responseValidator = require('./../responseValidator');
const errorMessages = require('./../../utils/errors/messages');

describe('responseValidator', function() {
  context('when valid input is passed in', function() {
    it('should return false', function() {
      expect(responseValidator({})).to.be.false;
    });
  });

  context('when "null" string input is passed in', function() {
    it('should return false', function() {
      expect(responseValidator("null")).to.be.true;
      expect(responseValidator("Null")).to.be.true;
    });
  });

  context('when null input is passed in', function() {
    it('should return false', function() {
      expect(responseValidator(null)).to.be.true;
    });
  });

  context('when "undefined" string input is passed in', function() {
    it('should return false', function() {
      expect(responseValidator("undefined")).to.be.true;
      expect(responseValidator("Undefined")).to.be.true;
    });
  });

  context('when undefined input is passed in', function() {
    it('should return false', function() {
      expect(responseValidator(undefined)).to.be.true;
    });
  });
});
