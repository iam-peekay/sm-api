const vehicleHandlers = require('./../handlers/vehicle');

module.exports = (vehicles) => {
  vehicles.get('/:id', vehicleHandlers.getVehicleInfo);
  vehicles.get('/:id/doors', vehicleHandlers.getSecurityInfo);
  vehicles.get('/:id/fuel', vehicleHandlers.getFuelRange);
};
