const button = document.getElementsByTagName("button")[0];

button.addEventListener("click", async () => {
  const titleInput = document.getElementById("title");
  const messageInput = document.getElementById("message");

  let enteredTitle = titleInput.value;
  let enteredMessage = messageInput.value;

  try {
    const res = await fetch("/admin/forum", {
      method: "POST",
      body: JSON.stringify({ title: enteredTitle, message: enteredMessage }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 201) {
        console.log("Passed!");
    }

    const  data = await res.json();
    console.log(data);

    // enteredTitle = "" will not work! It only makes the enteredTitle an empty
    // string. Basically it passes the data by value instead of the reference
    titleInput.value = "";
    messageInput.value = "";
  } catch (err) {
    console.error(err);
  }
});
