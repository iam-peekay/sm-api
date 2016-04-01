const _ = require('lodash');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const errorMessages = require('./../utils/errors/messages');
const errorClass = require('./../utils/errors/errors');
const log = bunyan.createLogger({
  name: 'handlers/routeHandler',
  level: 'warn',
});

/*
* Base method used by public Smartcar's facing api routes to handle requests
*/

const routeHandler = (vehicleHandler) => {
  return (request, response, next) => {
    if (!vehicleHandler || !_.isObject(vehicleHandler) || !vehicleHandler._handleRequest) {
      log.warn('vehicle handler is undefined or invalid');
      return response.status(500).send(new errorClass.smartcarServerError(errorMessages.smartcarServerError));
    }
    /*
    * Returns a new function that wraps the given vehicle request handler
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
    return handleRequest(request)
            .then((result) => {
            // Send back response as JSON object
              return response.json(result);
            }).catch((error) => {
               return response.status(400).send({ error: error });
            });
  };
};

module.exports = routeHandler;
