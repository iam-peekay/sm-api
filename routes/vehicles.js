const vehicleHandlers = require('./../handlers/vehicle');

/*
* Here we define Smartcar's public facing API routes The routes pass
* the request to the appropriate vehicle handler function.
*/

module.exports = (vehicles) => {

  /**
  * @function Get vehicle information
  * @param {string} id Vehicle's id
  * @returns {Object}
  * {
  *   "vin": "1213231",
  *   "color": "Metallic Silver",
  *   "doorCount": 4,
  *   "driveTrain": "v8"
  * }
  */

  vehicles.get('/:id', vehicleHandlers.getVehicleInfo);

  /**
  * @function Get security information
  * @param {String} id Vehicle's id
  * @returns {Array}
  * [
  *   {
  *     "location": "frontLeft",
  *     "locked": true
  *   },
  *   {
  *     "location": "frontRight",
  *     "locked": true
  *   }
  * ]
  *
  */

  vehicles.get('/:id/doors', vehicleHandlers.getSecurityInfo);

  /**
  * @function Get vehicle fuel range
  * @param {string} id Vehicle's id
  * @returns {Object}
  * {
  *   "percent": 30,
  * }
  */

  vehicles.get('/:id/fuel', vehicleHandlers.getFuelRange);

  /**
  * @function Get vehicle battery range
  * @param {string} id Vehicle's id
  * @returns {Object}
  * {
  *   "percent": 50,
  * }
  */
  vehicles.get('/:id/battery', vehicleHandlers.getBatteryRange);

  /**
  * @function Start or stop engine
  * @param {string} id Vehicle's id
  * @param {string} action (START vs. STOP)
  * @returns {Object}
  * {
  *   "status": "success|error",
  * }
  */
  vehicles.post('/:id/engine', vehicleHandlers.postEngine);
};
