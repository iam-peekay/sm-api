const routeProcessor = require('./../routeProcessor');
const getVehicleInfo = require('./get_vehicle_info');
const handlers = {};

handlers.getVehicleInfo = routeProcessor(getVehicleInfo);

module.exports = handlers;
