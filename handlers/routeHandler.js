const Promise = require('bluebird');

const routeHandler = (vehicleHandler) => {
  return (req, res, next) => {
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
    return handleRequest(req)
            .then((response) => {
            // Send back response as JSON object
              return res.json(response);
            }).catch((error) => {
              console.log('=====sfsdfsd====', error)
              next(error); // if error, pass the error to next middleware function
            });
  };
};

module.exports = routeHandler;
