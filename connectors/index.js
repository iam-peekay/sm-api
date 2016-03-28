'use strict';

const _ = require('lodash');

let connectors = {};

connectors['GM'] = require('./GM_Connector');

connectors.getConnector = (vendor) => {
  const connector = connectors[vendor];
  if (!connector || !_.isFunction(connector)) {
    console.log('Error'); // TODO: build error handlers
    return;
  }

  return connector;
}

module.exports = connectors;
