// connect to the socket
const socket = io();

const messages = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");

// listen to chat message from server
socket.on("chat message", (message) => {
  outputMessage(message);
});

// Add a eventlistener to the form
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements["message-input"].value;
  socket.emit("chat message", message);
  e.target.elements.message.value = "";
  e.target.elements.message.focus();
});

// output the message to the DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");

  if (message.sender === "bot") {
    div.innerHTML = `Bot Message: ${message}`;
  } else {
    div.innerHTML = `User Message: ${message}`;
  }
  messages.appendChild(div);
};
