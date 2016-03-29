const axios = require('axios');
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'connectors/GM_connector' });
const errorClass = require('./../utils/errors/errors');
const instance = axios.create({
  baseURL: 'http://gmapi.azurewebsites.net',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});
const retryFailedRequest = (err) => {
  if (err.status >= 500 && err.config && !err.config.__isRetryRequest) {
    err.config.__isRetryRequest = true;
    return instance(err.config);
  }
  throw err;
};
instance.interceptors.response.use(undefined, retryFailedRequest);

function GMConnectorModule() {}

GMConnectorModule.prototype._getVehicleInfo = function (args) {
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
}

GMConnectorModule.prototype._getSecurityInfo = function (args) {
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
}

GMConnectorModule.prototype._getFuelRange = function (args) {
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
}

GMConnectorModule.prototype._getBatteryRange = function (args) {
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

GMConnectorModule.prototype._postEngine = function (args) {
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
      message: 'Error processing POST request to actionEngineService.',
    });
    throw new errorClass.OemRequestError(error);
  });
}

module.exports = GMConnectorModule;
