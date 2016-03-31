const nockActionEngineService = {
  success: {
    "service": "actionEngine",
    "status": "200",
    "actionResult": {
      "status": "EXECUTED"
    }
  },
  error: {
    "status": "404",
    "reason": "Vehicle id: 1239 not found."
  }
};

module.exports = nockActionEngineService;
