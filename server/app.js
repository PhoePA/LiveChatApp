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

// run when client-server connected
io.on("connection", (socket) => {
  console.log("client connected");
  const BOT = "Room Manager Bot";

  socket.emit("message", formatMessage(BOT, "Welcome to the room"));
  // send joined to all users except joined users
  socket.broadcast.emit(
    "message",
    formatMessage(BOT, "Anonymous User Join Room!")
    );
    
    socket.on("disconnect", _ => {
        io.emit("message", formatMessage(BOT, "Anonymous User Leave the Room!"));
    })
});
