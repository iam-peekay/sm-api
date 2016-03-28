/*
* This is a fake authentication middleware to show that in a real-case
* scenario, we'd want to authenticate vehicles before processing the
* request
*/
const errorClass = require('./../utils/errors/errors');
const authenticate = {};

authenticate.vehicle = function(req, res, next) {
  // Here is where we'd want to check for permissions and
  // throw an error if check fails
  if (!req) {
    return next(new errorClass.authenticationError('Not authorized'))
  }
  // If auth/permissions check passes, move on...
  next();
}
