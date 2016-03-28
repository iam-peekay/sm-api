const url = require('url');

const buildUrl = (host, pathname) => {
  return url.format({
    protocol: 'http',
    host: host,
    pathname: pathname
  })
};

module.exports = buildUrl;
