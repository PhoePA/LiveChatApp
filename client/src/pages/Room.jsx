import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
const Room = ({ room, username, socket }) => {
  const navigate = useNavigate();
  const [roomUsers, setRoomUsers] = useState(["user1", "user2", "user3"]);
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(
    (_) => {
      socket.on("message", (data) => {
        setReceivedMessages((prev) => [...prev, data]);
      });
      return () => socket.disconnect();
    },
    [socket]
  );

  const leaveRoom = () => {
    navigate("/");
  };
  return (
    <section className="flex gap-4 h-screen">
      {/* left side */}
      <div className="w-1/3 bg-blue-500 text-white font-medium relative">
        <div>
          <p className="text-3xl text-center mt-5">Room.IO</p>
          <div className="mt-10 ps-2">
            <p className="flex gap-1 text-center text-lg mb-3">
              <ChatBubbleLeftRightIcon width={25} />
              Room Name
            </p>
            <p className="bg-white text-blue-500 ps-3 py-2 rounded-tl-full rounded-bl-full my-2">
              {room}
            </p>
          </div>
          <div className="mt-5 ps-2">
            <p className="flex gap-1 text-center text-lg mb-3">
              <UserGroupIcon width={25} /> Users
            </p>
            {roomUsers.map((user, i) => (
              <p key={i} className="flex gap-1 text-center my-2 text-sm">
                <UserIcon width={20} />
                {user}
              </p>
            ))}
          </div>
          <button
            type="button"
            className="absolute bottom-0 flex gap-1 w-full mx-2 mb-5 text-center items-center text-lg"
            onClick={leaveRoom}
          >
            {" "}
            <ArrowRightOnRectangleIcon width={25} />
            Leave Room
          </button>
        </div>
      </div>
      {/* right side */}
      <div className="w-full mt-5 relative ">
        <div className="h-[30rem] overflow-y-auto">
          {receivedMessages.map((msg, i) => (
            <div
              key={i}
              className=" text-white bg-slate-600 p-4 w-3/4 m-3 rounded-br-3xl rounded-tl-3xl"
            >
              <p className="text-sm font-medium font-mono">From {username}</p>
              <p className="text-lg font-medium break-words indent-5 mb-3">
                {msg.message}
              </p>
              <p className="text-sm font-mono font-medium text-right">
                {formatDistanceToNow(new Date(msg.send_at))}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full flex items-end border-b-2 my-5 py-2.4 pr-4 ">
          <input
            type="text"
            placeholder="Type messages ..."
            className="w-full outline-none border-b text-lg me-2 focus:font-bold "
          />
          <button type="button">
            <PaperAirplaneIcon
              width={30}
              className="text-zinc-600 hover:text-zinc-800 hover:-rotate-45 duration-200"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Room;
