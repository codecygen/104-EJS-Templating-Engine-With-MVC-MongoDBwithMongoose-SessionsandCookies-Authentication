const checkCsrfToken = (clientCsrfToken, serverCsrfToken) => {
  if (clientCsrfToken !== serverCsrfToken) {
    console.error("Invalid CSRF Token!");
    return false;
  }

  return true;
};

module.exports = checkCsrfToken;
