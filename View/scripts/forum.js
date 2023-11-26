const button = document.getElementsByTagName("button")[0];

button.addEventListener("click", () => {
    const titleInput = document.getElementById("title");
    const messageInput = document.getElementById("message");

    let enteredTitle = titleInput.value;
    let enteredMessage = messageInput.value;

    console.log(enteredTitle);
    console.log(enteredMessage);

    // enteredTitle = "" will not work! It only makes the enteredTitle an empty
    // string. Basically it passes the data by value instead of the reference
    titleInput.value = "";
    messageInput.value = "";
});