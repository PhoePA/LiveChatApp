const express = require("express");
const socketIO = require("socket.io");

const cors = require("cors");
const formatMessage = require("./utils/formatMSG");

const app = express();
app.use(cors());

const server = app.listen(4000, (_) => {
  console.log("server is running at port : 4000");
});

const io = socketIO(server, {
  cors: "*",
});

const users = [];

const savedUser = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);
  return user;
};

const disconnectUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// same room users
const getSameRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

// run when client-server connected
io.on("connection", (socket) => {
  console.log("client connected");

  const BOT = "Room Manager Bot";

  // fired when user joined room
  socket.on("join_room", (data) => {
    const { username, room } = data;
    const user = savedUser(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage(BOT, "Welcome to the room"));

    // send joined to all users except joined users
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(BOT, user.username + " Join the Room!"));

    // listen message from client
    socket.on("message_sent", (data) => {
      //  console.log(data);

      // send back message to client
      io.to(user.room).emit("message", formatMessage(user.username, data));
    });

    io.to(user.room).emit("room_users", getSameRoomUsers(user.room));
  });

  //send disconnect message to all user except left users
  socket.on("disconnect", (_) => {
    const user = disconnectUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(BOT, `${user.username}  Leave the Room!`)
      );
    }
  });
});
