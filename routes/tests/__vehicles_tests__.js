const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./../../index');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('/vehicles api route', function() {
  it('should get vehicle info on /vehicles/:id GET', function(done) {
    chai.request(server)
      .get('/vehicles/1234')
      .end(function(error, response){
        should.not.exist(error);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('vin');
        response.body.should.have.property('color');
        response.body.should.have.property('doorCount');
        response.body.should.have.property('driveTrain');
        done();
      });
  });

  it('should get vehicle security info on /vehicles/:id/doors GET', function(done) {
    chai.request(server)
      .get('/vehicles/1234/doors')
      .end(function(error, response){
        should.not.exist(error);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.should.have.lengthOf(2);
        done();
      });
  });

  it('should get vehicle fuel info on /vehicles/:id/fuel GET', function(done) {
    chai.request(server)
      .get('/vehicles/1234/fuel')
      .end(function(error, response){
        should.not.exist(error);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('percent');
        done();
      });
  });

  it('should get vehicle battery info on /vehicles/:id/battery GET', function(done) {
    chai.request(server)
      .get('/vehicles/1234/battery')
      .end(function(error, response){
        should.not.exist(error);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('percent');
        done();
      });
  });

  it('should get vehicle battery info on /vehicles/:id/battery GET', function(done) {
    chai.request(server)
      .post('/vehicles/1234/engine')
      .send({ 'action': 'stARt' })
      .end(function(error, response){
        should.not.exist(error);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('status');
        done();
      });
  });
});
