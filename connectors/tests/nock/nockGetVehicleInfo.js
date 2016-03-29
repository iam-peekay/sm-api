const nockGetVehicleInfo = {
  success: {
    "service": "getVehicleInfo",
    "status": "200",
    "data": {
      "vin": {
        "type": "String",
        "value": "123123412412"
      },
      "color": {
        "type": "String",
        "value": "Metallic Silver"
      },
      "fourDoorSedan": {
        "type": "Boolean",
        "value": "True"
      },
      "twoDoorCoupe": {
        "type": "Boolean",
        "value": "False"
      },
      "driveTrain": {
        "type": "String",
        "value": "v8"
      }
    }
 },
  error: {
    "status": "404",
    "reason": "Vehicle id: 1239 not found."
  }
};

module.exports = nockGetVehicleInfo;
