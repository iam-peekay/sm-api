const invalidResponse = (value) => {
  if (value === 'Null' || value === 'null' || value === null || value === 'Undefined' || value === 'undefined' || value === undefined) {
    return true;
  }

  return false;
}

module.exports = invalidResponse;
