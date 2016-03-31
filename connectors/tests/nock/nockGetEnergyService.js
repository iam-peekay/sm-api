const nockGetEnergyService = {
  success: {
    "service": "getEnergy",
    "status": "200",
    "data": {
      "tankLevel": {
        "type": "Number",
        "value": "64.94"
      },
      "batteryLevel": {
        "type": "Null",
        "value": "null"
      }
    }
  },
  error: {
    "status": "404",
    "reason": "Vehicle id: 1239 not found."
  }
};

module.exports = nockGetEnergyService;
