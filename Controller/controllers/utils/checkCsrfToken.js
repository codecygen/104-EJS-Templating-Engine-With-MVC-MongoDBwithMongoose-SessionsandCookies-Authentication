const checkCsrfToken = (res, clientCsrfToken, serverCsrfToken) => {
  if (clientCsrfToken !== serverCsrfToken) {
    return res.status(404).render("404", {
      renderTitle: "No Page Found!",
      pagePath: "NA",
      // router.use(populateSelectedUser); // this middleware populates res.locals
      // because it is stored in res.locals, res.render template
      // can reach to selectedUser that is in res.locals
      // selectedUser: res.locals.selectedUser,
    });
  }
};

module.exports = checkCsrfToken;
