'use strict';

const vehicleHandlers = require('./../handlers/vehicle');

module.exports = (vehicles) => {
  vehicles.get('/:id', vehicleHandlers.getVehicleInfo);
};
