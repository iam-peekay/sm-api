const url = require('url');

const buildUrl = (host, pathname) => {
  return url.format({
    protocol: 'http',
    host,
    pathname,
  });
};

module.exports = buildUrl;
