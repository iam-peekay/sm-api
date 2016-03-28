'use strict';

const routeProcessor = require('./../routeProcessor');
const getVehicleInfo = require('./get_vehicle_info');
let handlers = {};

handlers.getVehicleInfo = routeProcessor(getVehicleInfo)

module.exports = handlers;
