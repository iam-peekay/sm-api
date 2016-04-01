/*
* Checks if input is either null or undefined. This is primarily used to
* clean up bad/inconsistent responses from GM. For example, some responses
* from GM API return with 200 status code but the fields are 'null'. So
* this is just a simple function to detect bad responses.
*/
const invalidResponse = (value) => {
  if (value === 'Null' || value === 'null' || value === null || value === 'Undefined' || value === 'undefined' || value === undefined) {
    return true;
  }

  return false;
};

module.exports = invalidResponse;
