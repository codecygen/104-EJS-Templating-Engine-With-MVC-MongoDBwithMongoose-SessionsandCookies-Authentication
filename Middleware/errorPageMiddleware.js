// Multer-File-Upload-Download
const multer = require("multer");

// Error-Page-Middleware
const errorPageMiddleware = (err, req, res, next) => {
  // Multer-File-Upload-Download
  // multer related file upload errors!
  if (err instanceof multer.MulterError) {
    console.error(err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size is exceeded!" });
    }
  } else if (err.httpStatusCode) {
    return res.status(err.httpStatusCode).render("[errorPage]", {
      renderTitle: `HTTP Error: ${err.httpStatusCode}`,
      pagePath: null,
      err: err,
    });
  }
};

module.exports = errorPageMiddleware;
