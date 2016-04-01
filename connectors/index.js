const _ = require('lodash');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'connectors/index',
  level: 'warn',
});

// Define our connectors object with each vendor's connectors
const connectors = {};

connectors.GM = require('./GM_Connector');

/*
* Method that returns the appropriate connector based on the vendor
* argument value passed in.
*/
connectors.getConnector = (vendor) => {
  const Connector = connectors[vendor];
  if (!Connector || !_.isObject(Connector)) {
    log.warn(`Error retrieving ${vendor}'s connector`);
    throw new Error();
  }

  return new Connector();
};

module.exports = connectors;
