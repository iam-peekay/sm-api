// const _ = require('lodash');
// const Promise = require('bluebird');
const bunyan = require('bunyan');
const axios = require('axios');
const errorClass = require('./../utils/errors/errors');
const instance = axios.create({
  baseURL: 'http://gmapi.azurewebsites.net',
  headers: { 'Content-Type': 'application/json' },
});
const log = bunyan.createLogger({ name: 'connectors/GM_connector' });

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
    throw new errorClass.OemRequestError(error);
  });
};

GMConnector.getSecurityInfo = (args) => {
  log.info({
    method: 'getSecurityInfo',
    type: 'POST',
    vehicleid: args.id,
  });

  return instance.post('/getSecurityStatusService', {
    id: args.id,
    responseType: 'JSON',
  })
  .then((response) => response.data)
  .catch((error) => {
    log.error({
      vendor: 'GM',
      message: 'Error processing POST request to getSecurityInfo.',
    });
    throw new errorClass.OemRequestError(error);
  });
};

GMConnector.getFuelRange = (args) => {
  log.info({
    method: 'getFuelRange',
    type: 'POST',
    vehicleid: args.id,
  });

  return instance.post('/getEnergyService', {
    id: args.id,
    responseType: 'JSON',
  })
  .then((response) => response.data)
  .catch((error) => {
    log.error({
      vendor: 'GM',
      message: 'Error processing POST request to getEnergyService.',
    });
    throw new errorClass.OemRequestError(error);
  });
};

GMConnector.getBatteryRange = (args) => {
  log.info({
    method: 'getBatteryRange',
    type: 'POST',
    vehicleid: args.id,
  });

  return instance.post('/getEnergyService', {
    id: args.id,
    responseType: 'JSON',
  })
  .then((response) => response.data)
  .catch((error) => {
    log.error({
      vendor: 'GM',
      message: 'Error processing POST request to getEnergyService.',
    });
    throw new errorClass.OemRequestError(error);
  });
};

GMConnector.postEngine = (args) => {
  log.info({
    method: 'getBatteryRange',
    type: 'POST',
    vehicleid: args.id,
    action: args.action
  });

  const postEngineType = {
    id: args.id,
    command: args.action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE',
    responseType: 'JSON',
  };

  return instance.post('/actionEngineService', postEngineType)
  .then((response) => response.data)
  .catch((error) => {
    log.error({
      vendor: 'GM',
      message: 'Error processing POST request to getEnergyService.',
    });
    throw new errorClass.OemRequestError(error);
  });
};

module.exports = GMConnector;
