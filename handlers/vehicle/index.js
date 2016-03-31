const routeHandler = require('./../routeHandler');
const getVehicleInfo = require('./get_vehicle_info');
const getSecurityInfo = require('./get_security_info');
const getFuelRange = require('./get_fuel_range');
const getBatteryRange = require('./get_battery_range');
const postEngine = require('./post_engine');

const handlers = {};

handlers.getVehicleInfo = routeHandler(getVehicleInfo);
handlers.getSecurityInfo = routeHandler(getSecurityInfo);
handlers.getFuelRange = routeHandler(getFuelRange);
handlers.getBatteryRange = routeHandler(getBatteryRange);
handlers.postEngine = routeHandler(postEngine);

module.exports = handlers;
