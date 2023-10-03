const express = require("express");
const socketIO = require("socket.io");

const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const formatMessage = require("./utils/formatMSG");
const { savedUser, getSameRoomUsers, disconnectUser } = require("./utils/user");

const Message = require("./models/Message");
const messageController = require("./controller/message");

const app = express();
app.use(cors());

app.get("/chat/:roomName", messageController.getOldMessage);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to Database");
});

const server = app.listen(4000, (_) => {
  console.log("server is running at port : 4000");
});

const io = socketIO(server, {
  cors: "*",
});

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

      // store message in DB
      Message.create({
        username: user.username,
        message: data,
        room: user.room,
      });
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
      // update room users when disconnected
      io.to(user.room).emit("room_users", getSameRoomUsers(user.room));
    }
  });
});
