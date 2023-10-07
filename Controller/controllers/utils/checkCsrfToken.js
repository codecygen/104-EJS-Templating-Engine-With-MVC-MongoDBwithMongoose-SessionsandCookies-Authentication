const checkCsrfToken = (clientCsrfToken, serverCsrfToken) => {
  if (clientCsrfToken !== serverCsrfToken) {
    throw new Error("Invalid CSRF Token!");
  }
};

module.exports = checkCsrfToken;
