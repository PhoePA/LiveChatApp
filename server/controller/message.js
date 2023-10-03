const Message = require("../models/Message");

const OPEN_ROOMS = ["React", "Node", "JavaScript"];

exports.getOldMessage = (req, res, next) => {
  const { roomName } = req.params;
  if (OPEN_ROOMS.includes(roomName)) {
    Message.find({ room: roomName })
      .select("username message sent_at")
      .then((messages) => {
        return res.status(200).json(messages);
      });
  } else {
    res.status(403).json("Room is not opened!");
  }
};
