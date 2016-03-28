// const _ = require('lodash');
// const Promise = require('bluebird');
const bunyan = require('bunyan');
const axios = require('axios');
const instance = axios.create({
  baseURL: 'http://gmapi.azurewebsites.net',
  headers: { 'Content-Type': 'application/json' },
});
const log = bunyan.createLogger({
  name: 'connectors/GM_connector',
  level: 'debug',
});

function GMConnector() {
  console.log('anything?');
}

GMConnector.getVehicleInfo = (args) => {
  log.info({
    method: 'getVehicleInfo',
    type: 'POST',
    vehicleid: args.id,
  });

  return instance.post('/getVehicleInfoService', {
    id: args.id,
    responseType: 'JSON',
  })
  .then((response) => response.data)
  .catch((error) => {
    log.error({
      vendor: 'GM',
      message: 'Error processing POST request to getVehicleInfo.',
    });
    throw new Error(error.stack);  // TODO: Build error class/handlers
  });
};

module.exports = GMConnector;
