// Error-Page-Middleware
const errorPageMiddleware = (err, req, res, next) => {
  res.status(err.httpStatusCode).render("[errorPage]", {
    renderTitle: `HTTP Error: ${err.httpStatusCode}`,
    pagePath: null,
    err: err,
  });
};

module.exports = errorPageMiddleware;