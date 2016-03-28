const routeProcessor = require('./../routeProcessor');
const getVehicleInfo = require('./get_vehicle_info');
const getSecurityInfo = require('./get_security_info');
const getFuelRange = require('./get_fuel_range');
const getBatteryRange = require('./get_battery_range');

const handlers = {};

handlers.getVehicleInfo = routeProcessor(getVehicleInfo);
handlers.getSecurityInfo = routeProcessor(getSecurityInfo);
handlers.getFuelRange = routeProcessor(getFuelRange);
handlers.getBatteryRange = routeProcessor(getBatteryRange);

module.exports = handlers;
