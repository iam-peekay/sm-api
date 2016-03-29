const invalidResponse = (value) => {
  if (value === 'Null' || value === 'null' || value === 'Undefined' || value === 'undefined') {
    return true;
  }

  return false;
}

module.exports = invalidResponse;
