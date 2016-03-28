const routeProcessor = require('./../routeProcessor');
const getVehicleInfo = require('./get_vehicle_info');
const getSecurityInfo = require('./get_security_info');

const handlers = {};

handlers.getVehicleInfo = routeProcessor(getVehicleInfo);
handlers.getSecurityInfo = routeProcessor(getSecurityInfo);

module.exports = handlers;
