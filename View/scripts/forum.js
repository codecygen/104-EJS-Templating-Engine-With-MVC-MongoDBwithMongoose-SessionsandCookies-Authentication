const button = document.getElementsByTagName("button")[0];

button.addEventListener("click", () => {
    const titleInput = document.getElementById("title");
    const messageInput = document.getElementById("message");

    let enteredTitle = titleInput.value;
    let enteredMessage = messageInput.value;

    console.log(enteredTitle);
    console.log(enteredMessage);

    titleInput.value = "";
    messageInput.value = "";
});