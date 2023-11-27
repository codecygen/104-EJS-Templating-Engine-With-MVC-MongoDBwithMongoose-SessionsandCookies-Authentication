const email = (enteredEmail) => {
  const escapedEmail = enteredEmail.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const emailTest = escapedEmail
    .toString()
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  if (emailTest) {
    return escapedEmail;
  }

  return null;
};

const password = (enteredPassword) => {
  if (enteredPassword.length) {
    return enteredPassword;
  }

  return null;
};

const title = (enteredTitle) => {
  const escapedTitle = enteredTitle.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (escapedTitle.length) {
    return escapedTitle;
  }

  return null;
};

const message = (enteredMessage) => {
    const escapedMessage = enteredMessage.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
    if (escapedMessage.length) {
      return escapedMessage;
    }
  
    return null;
  };

export { email, password, title, message };
