const express = require("express");
const path = require("path");
const ejs = require("ejs");
const http = require("http");
const socketio = require("socket.io");

let users = [];

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

// SET UP VIEW ENGINE
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

// IO
io.on("connection", (socket) => {
  // user join room
  socket.on("join room", (user) => {
    socket.join(user.idRoom);
    users.push(socket.id);
    socket.emit("message", users.length);
    socket.broadcast.to(user.idRoom).on("chat-message", (data) => {
      io.to(user.idRoom).emit("message-chat", {
        username: user.username,
        message: data,
      });
    });
    socket.broadcast.to(user.idRoom).emit("message-join", {username : user.username, numberUser : users.length});
    socket.broadcast.to(user.idRoom).on("disconnect", () => {
      users.splice(users.indexOf(socket.id),1);
      io.to(user.idRoom).emit("message-leave", {
        username: user.username,
        numberUser: users.length,
      });
    });
  });
});

// ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/room", (req, res) => {
  res.render("room");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
