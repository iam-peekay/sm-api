const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const errorConstants = require('./../utils/errors/constants');
const ErrorClass = require('./../utils/errors/errors');
const log = bunyan.createLogger({
  name: 'handlers/routeHandler',
  level: 'warn',
});

/*
* Base method used by public Smartcar's facing api routes to handle requests
*/

const routeHandler = (vehicleHandler) => {
  return (req, res) => {
    // If vehicle handler is missing, throw error immediately
    if (!vehicleHandler || !_.isObject(vehicleHandler) || !vehicleHandler._handleRequest) {
      const error = new ErrorClass.smartcarServerError('Invalid or missing vehicle handler.');
      log.warn('vehicle handler is undefined or invalid: ', error);
      return res.status(500).send({ error: error.error, message: error.message });
    }
    /*
    * Returns a new function that wraps the given vehicle request handler.
    * The new function will return a promise that is fulfilled with the
    * original function's return values or rejected with thrown exceptions
    * from the original function.
    */
    const handleRequest = Promise.method(vehicleHandler._handleRequest);
    /*
    * Pass request to the specified vehicle request handler,
    * which will verify and process the request and send back
    * a formatted response.
    */
    return handleRequest(req, res)
            .then((result) => { return res.json(result); }) // Send back response as JSON object
            .catch((error) => {
               // If the error propogated up to here, then it must mean it's an
               // uncaught exception.
              log.warn('Uncaught program error, please check logs ASAP: ', error);
              return res.status(500).send({
                error: 'null',
                message: errorConstants.smartcarServerError,
              });
            });
  };
};

module.exports = routeHandler;
