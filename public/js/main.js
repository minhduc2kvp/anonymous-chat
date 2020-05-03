const socket = io();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get("username");
const idRoom = urlParams.get("idRoom");

// DOM
const listMessages = document.getElementById("list-message");
const form = document.getElementById("form-message");
document.getElementById('id-room').innerText = idRoom;

socket.emit("join room", { username: username, idRoom: idRoom });
socket.on("message", (data) => {
  const li = document.createElement("li");
  li.style.color = "white";
  li.innerText = "Welcome to the anonymous chat...";
  listMessages.append(li);
  document.getElementById('number-user').innerText = data;
});
socket.on("message-join", (data) => {
  const li = document.createElement("li");
  li.innerHTML = `<span style="color : green;"><strong>${data.username}</strong> has joined the chat</span>`;
  listMessages.append(li);
  document.getElementById('number-user').innerText = data.numberUser;
  document.body.scrollTop = listMessages.scrollHeight;
  document.documentElement.scrollTop = listMessages.scrollHeight;
});
socket.on("message-leave", (data) => {
  const li = document.createElement("li");
  li.innerHTML = `<span style="color : red;"><strong>${data.username}</strong> left the chat</span>`;
  listMessages.append(li);
  document.getElementById('number-user').innerText = data.numberUser;
  document.body.scrollTop = listMessages.scrollHeight;
  document.documentElement.scrollTop = listMessages.scrollHeight;
});
socket.on("message-chat", (data) => {
  const li = document.createElement("li");
  li.setAttribute("class", "message");
  li.innerHTML = `<strong>${new Date().toLocaleString()}- ${data.username}: </strong>${data.message}`;
  listMessages.append(li);
  document.body.scrollTop = listMessages.scrollHeight;
  document.documentElement.scrollTop = listMessages.scrollHeight;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.getElementById("message").value;
  socket.emit("chat-message", msg);
  document.getElementById("message").value = null;
  document.getElementById("message").focus();
  return false;
});
