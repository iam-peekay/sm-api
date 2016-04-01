const vehicleHandlers = require('./../handlers/vehicle');

/*
* Here we define Smartcar's public facing API routes The routes pass
* the request to the appropriate vehicle handler function.
*/

module.exports = (vehicles) => {
  vehicles.get('/:id', vehicleHandlers.getVehicleInfo);

  vehicles.get('/:id/doors', vehicleHandlers.getSecurityInfo);

  vehicles.get('/:id/fuel', vehicleHandlers.getFuelRange);

  vehicles.get('/:id/battery', vehicleHandlers.getBatteryRange);

  vehicles.post('/:id/engine', vehicleHandlers.postEngine);
};
