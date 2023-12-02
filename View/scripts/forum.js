import * as sanitizeInput from "./sanitizeValidateForum.js";

const button = document.getElementsByTagName("button")[0];

button.addEventListener("click", async () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const titleInput = document.getElementById("title");
  const messageInput = document.getElementById("message");
  const csrfTokenInput = document.getElementById("csrf");

  let enteredEmail = emailInput.value;
  let enteredPassword = passwordInput.value;
  let enteredTitle = titleInput.value;
  let enteredMessage = messageInput.value;
  let csrfToken = csrfTokenInput.value;

  const validatedEmail = sanitizeInput.email(enteredEmail);
  const validatedPassword = sanitizeInput.password(enteredPassword);
  const validatedTitle = sanitizeInput.title(enteredTitle);
  const validatedMessage = sanitizeInput.message(enteredMessage);

  let warningMessage = document.getElementById("warning-message");

  if (!validatedEmail) {
    warningMessage.classList.add("warning-message");
    return (warningMessage.textContent = "Wrong Email Format!");
  }

  if (!validatedPassword) {
    warningMessage.classList.add("warning-message");
    return (warningMessage.textContent = "No Password Provided!");
  }

  if (validatedPassword.length < 2) {
    warningMessage.classList.add("warning-message");
    return (warningMessage.textContent =
      "Password must have at least 2 characters!");
  }

  if (!validatedTitle) {
    warningMessage.classList.add("warning-message");
    return (warningMessage.textContent = "Please Write a Title!");
  }

  if (!validatedMessage) {
    warningMessage.classList.add("warning-message");
    return (warningMessage.textContent = "Please Provide a Forum Message!");
  }

  try {
    const res = await fetch("/admin/forum", {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        title: enteredTitle,
        message: enteredMessage,
        csrfToken: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    // Trying to rearrange the input fields in the same order with
    // express-validator error array so if email fails it will only
    // send email
    if (data.errors && data.inputs) {
      for (const input of data.inputs) {
        for (const error of data.errors) {
          if (!error.path) {
            warningMessage.classList.add("warning-message");
            return (warningMessage.textContent =
              "Something went awry. Contact admin!");
          }

          if (input === error.path) {
            warningMessage.classList.add("warning-message");
            return (warningMessage.textContent = await error.msg);
          }

          if (error.path === "server-error") {
            warningMessage.classList.add("warning-message");
            return (warningMessage.textContent = await error.msg);
          }
        }
      }
    }

    if (res.status !== 201) {
      warningMessage.classList.add("warning-message");
      return (warningMessage.textContent =
        "Cannot create forum post! Contact admin!");
    }

    // enteredTitle = "" will not work! It only makes the enteredTitle an empty
    // string. Basically it passes the data by value instead of the reference
    emailInput.value = "";
    passwordInput.value = "";
    titleInput.value = "";
    messageInput.value = "";

    if (!data.success || !data.success.msg) {
      warningMessage.classList.add("success-message");
      return (warningMessage.textContent =
        "Success message is missing, contact admin!");
    }

    const { forumTitle, forumMessage, forumUser } = data.success;
    console.log(forumTitle);
    console.log(forumMessage);
    console.log(forumUser);

    const forumContainer = document.getElementById("forum-container");
    const firstChild = forumContainer.firstChild;

    const newArticleTag = document.createElement("article");

    const newH3Tag = document.createElement("h3");
    const h3Text = document.createTextNode(forumTitle);
    newH3Tag.appendChild(h3Text);

    const newPTag = document.createElement("p");
    const pText = document.createTextNode(forumMessage);
    newPTag.appendChild(pText);

    const newEmTag = document.createElement("em");
    const emText = document.createTextNode(
      new Date(Date.now()).toLocaleString()
    );
    newEmTag.appendChild(emText);

    const newEmTag2 = document.createElement("em");
    const emText2 = document.createTextNode(forumUser);
    newEmTag2.appendChild(emText2);

    newArticleTag.appendChild(newH3Tag);
    newArticleTag.appendChild(newPTag);
    newArticleTag.appendChild(newEmTag);
    newArticleTag.appendChild(newEmTag2);

    forumContainer.insertBefore(newArticleTag, firstChild);

    warningMessage.classList.add("success-message");
    return (warningMessage.textContent = data.success.msg);
  } catch (err) {
    console.error(err);

    warningMessage.classList.add("warning-message");
    return (warningMessage.textContent = `Failed to fetch forum data! ${err}`);
  }
});

// // Some DOM manipulation that worths noting
// let warningElement = document.createElement("p");
// warningElement.textContent = "Done!";

// let container = document.getElementById("forum-form");
// let firstChildOfContainer = container.firstChild;

// container.insertBefore(warningElement, firstChildOfContainer);
