const _ = require('lodash');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'connectors/GM_connector',
  level: 'debug',
});

const connectors = {};

connectors.GM = require('./GM_Connector');

connectors.getConnector = (vendor) => {
  const connector = connectors[vendor];
  if (!connector || !_.isFunction(connector)) {
    log.info(`Error retrieving ${vendor}'s connector`);
    throw new Error();
  }

  return connector;
};

module.exports = connectors;
