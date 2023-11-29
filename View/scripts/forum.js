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

  // const validatedEmail = sanitizeInput.email(enteredEmail);
  // const validatedPassword =sanitizeInput.password(enteredPassword);
  // const validatedTitle = sanitizeInput.title(enteredTitle);
  // const validatedMessage = sanitizeInput.message(enteredMessage);

  const validatedEmail = true;
  const validatedPassword = true;
  const validatedTitle = true;
  const validatedMessage = true;

  let warningMessage = document.getElementById("warning-message");

  if (!validatedEmail) {
    return warningMessage.textContent = "Wrong Email Format!";
  }

  if (!validatedPassword) {
    return warningMessage.textContent = "No Password Provided!";
  }

  if (!validatedTitle) {
    return warningMessage.textContent = "Please Write a Title!";
  }

  if (!validatedMessage) {
    return warningMessage.textContent = "Please Provide a Forum Message!";
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

    warningMessage.textContent = "DONE!";

    if (res.status === 201) {
      console.log("Passed!");
    }

    const data = await res.json();

    console.log(res.status);
    console.log(data);
    console.log(data.errors);
    console.log(typeof data.errors);

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
