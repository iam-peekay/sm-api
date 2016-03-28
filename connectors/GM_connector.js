'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const url = require('url');
const bunyan = require('bunyan');
const axios = require('axios');
const buildUrl = require('./../utils/buildUrl');
const instance = axios.create({
  baseURL: 'http://gmapi.azurewebsites.net',
  headers: {'Content-Type': 'application/json'},
});
const log = bunyan.createLogger({
  name: 'connectors/GM_connector',
  level: 'debug'
});

function GMConnector() {
  console.log('anything?');
};

GMConnector.getVehicleInfo = (vehicleid) => {

  log.info({
    method: 'getVehicleInfo',
    type: 'POST',
    vehicleid: vehicleid
  });

  return instance.post('/getVehicleInfoService', {
    id: vehicleid.toString(),
    responseType: 'JSON',
   })
   .then((response) => {
     return response.data;
   })
  .catch((error) => console.log(error, 'ERROR')); // TODO: Build error class/handlers
}

module.exports = GMConnector;
