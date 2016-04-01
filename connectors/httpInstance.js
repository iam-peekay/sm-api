const axios = require('axios');

// Create an axios instance with GM's base URL and request headers
const instance = axios.create({
  baseURL: 'http://gmapi.azurewebsites.net',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Interceptor which retries on failed requests
const retryFailedRequest = (error) => {
  if (error.status >= 500 && error.config && !error.config.__isRetryRequest) {
    error.config.__isRetryRequest = true;
    return instance(error.config);
  }
  throw error;
};
instance.interceptors.response.use(undefined, retryFailedRequest);

module.exports = instance;
