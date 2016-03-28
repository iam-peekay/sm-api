const _ = require('lodash');

const connectors = {};

connectors.GM = require('./GM_Connector');

connectors.getConnector = (vendor) => {
  const connector = connectors[vendor];
  if (!connector || !_.isFunction(connector)) {
    console.log('Error getting connector'); // TODO: build error handlers
    throw new Error();
  }

  return connector;
};

module.exports = connectors;
