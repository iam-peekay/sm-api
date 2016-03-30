const nockGetSecurityInfo = {
  success: {
    "service": "getSecurityStatus",
    "status": "200",
    "data": {
      "doors": {
        "type": "Array",
        "values": [
          {
            "location": {
              "type": "String",
              "value": "frontLeft"
            },
            "locked": {
              "type": "Boolean",
              "value": "False"
            }
          },
          {
            "location": {
              "type": "String",
              "value": "frontRight"
            },
            "locked": {
              "type": "Boolean",
              "value": "False"
            }
          }
        ]
      }
    }
  },
  error: {
    "status": "404",
    "reason": "Vehicle id: 1239 not found."
  }
};

module.exports = nockGetSecurityInfo;
