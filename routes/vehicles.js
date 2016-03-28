const vehicleHandlers = require('./../handlers/vehicle');

module.exports = (vehicles) => {
  vehicles.get('/:id', vehicleHandlers.getVehicleInfo);

  vehicles.get('/:id/doors', vehicleHandlers.getSecurityInfo);

  vehicles.get('/:id/fuel', vehicleHandlers.getFuelRange);

  vehicles.get('/:id/battery', vehicleHandlers.getBatteryRange);

  vehicles.post('/:id/engine', vehicleHandlers.postEngine);
};
