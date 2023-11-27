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
  const validatedPassword =sanitizeInput.password(enteredPassword);
  const validatedTitle = sanitizeInput.title(enteredTitle);
  const validatedMessage = sanitizeInput.message(enteredMessage);

  console.log(validatedEmail);
  console.log(validatedPassword);
  console.log(validatedTitle);
  console.log(validatedMessage);

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

    let warningMessage = document.getElementById("warning-message");
    warningMessage.textContent = "DONE!";

    if (res.status === 201) {
      console.log("Passed!");
    }

    await res.json();

    // enteredTitle = "" will not work! It only makes the enteredTitle an empty
    // string. Basically it passes the data by value instead of the reference
    emailInput.value = "";
    passwordInput.value = "";
    titleInput.value = "";
    messageInput.value = "";
  } catch (err) {
    console.error(err);
  }
});

// // Some DOM manipulation that worths noting
// let warningElement = document.createElement("p");
// warningElement.textContent = "Done!";

// let container = document.getElementById("forum-form");
// let firstChildOfContainer = container.firstChild;

// container.insertBefore(warningElement, firstChildOfContainer);
