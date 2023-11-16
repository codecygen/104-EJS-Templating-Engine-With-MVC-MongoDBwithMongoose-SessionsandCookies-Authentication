// Multer-File-Upload-Download
const multer = require("multer");

// Error-Page-Middleware
const errorPageMiddleware = (err, req, res, next) => {
  // Multer-File-Upload-Download
  // multer if file sie is more than 1MB
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      req.flash("add-product-message", "File size is exceeded!");
      return res.redirect("/admin/add-product");
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
