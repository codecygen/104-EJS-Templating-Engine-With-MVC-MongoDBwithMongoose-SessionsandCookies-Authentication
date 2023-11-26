const button = document.getElementsByTagName("button")[0];

button.addEventListener("click", () => {
    const enteredTitle = document.getElementById("title").value;
    const enteredMessage = document.getElementById("message").value;

    console.log(enteredTitle);
    console.log(enteredMessage);
});

console.log(enteredTitle, enteredMessage);
