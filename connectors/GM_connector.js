const instance = require('./httpInstance');
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'connectors/GM_connector' });
const errorClass = require('./../utils/errors/errors');

/**
* @description A module that connects to the GM API to makes API requests
* @private
*/

function GMConnectorModule() {}

/**
* @private
* @function Hits the /getVehicleInfoService endpoint to get basic
* vehicle info
* @param {Object} args Object with Vehicle's id
* @returns {Object} GM response object
*/

GMConnectorModule.prototype._getVehicleInfo = function (args) {
  log.info({
    method: '_getVehicleInfo',
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

/**
* @private
* @function Hits the /getSecurityStatusService endpoint to get vehicle
* security info
* @param {Object} args Object with Vehicle's id
* @returns {Object} GM response object
*/

GMConnectorModule.prototype._getSecurityInfo = function (args) {
  log.info({
    method: '_getSecurityInfo',
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

/**
* @private
* @function Hits the /getEnergyService endpoint to get vehicle's
* fuel range info
* @param {Object} args Object with Vehicle's id
* @returns {Object} GM response object
*/

GMConnectorModule.prototype._getFuelRange = function (args) {
  log.info({
    method: '_getFuelRange',
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

/**
* @private
* @function Hits the /getEnergyService endpoint to get vehicle's
* battery range info
* @param {Object} args Object with Vehicle's id
* @returns {Object} GM response object
*/

GMConnectorModule.prototype._getBatteryRange = function (args) {
  log.info({
    method: '_getBatteryRange',
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

/**
* @private
* @function Hits the /actionEngineService endpoint to send a
* start or stop signal to the vehicle
* @param {Object} args Object with Vehicle's id and type of action (START|STOP)
* @returns {Object} GM response object indicating execution status
*/

GMConnectorModule.prototype._postEngine = function (args) {
  log.info({
    method: '_postEngine',
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
