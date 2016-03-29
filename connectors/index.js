const _ = require('lodash');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'connectors/GM_connector',
  level: 'warn',
});

const connectors = {};

connectors['GM'] = require('./GM_Connector');

connectors.getConnector = (vendor) => {
  const Connector = connectors[vendor];
  if (!Connector || !_.isObject(Connector)) {
    log.warn(`Error retrieving ${vendor}'s connector`);
    throw new Error();
  }

  return new Connector();
};

module.exports = connectors;
