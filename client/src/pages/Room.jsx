import { useEffect, useRef, useState } from "react";
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
  const [roomUsers, setRoomUsers] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [message, setMessage] = useState("");

  const boxDivRef = useRef(null);

  const getOldMessages = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/chat/${room}`);
    if (response.status === 403) {
      return navigate("/");
    }
    const data = await response.json();
    setReceivedMessages((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    getOldMessages();
  }, []);

  useEffect(
    (_) => {
      // send joined user info to server
      socket.emit("join_room", { username, room });

      // get message from server
      socket.on("message", (data) => {
        setReceivedMessages((prev) => [...prev, data]);
      });

      //get room user from server
      socket.on("room_users", (data) => {
        let prevRoomUsers = [...roomUsers];
        data.forEach((user) => {
          const index = prevRoomUsers.findIndex(
            (prevUser) => prevUser.id === user.id
          );

          if (index !== -1) {
            prevRoomUsers[index] = { ...prevRoomUsers[index], ...data };
          } else {
            prevRoomUsers.push(user);
          }

          setRoomUsers(prevRoomUsers);
        });
      });

      return () => socket.disconnect();
    },
    [socket]
  );

  const sendMessage = () => {
    if (message.trim().length > 0) {
      socket.emit("message_sent", message);
      setMessage("");
    }
  };
  const leaveRoom = () => {
    navigate("/");
  };

  useEffect(() => {
    if (boxDivRef.current) {
      boxDivRef.current.scrollTop = boxDivRef.current.scrollHeight;
    }
  }, [receivedMessages]);

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
            <p className="flex gap-1 items-end text-lg mb-3">
              <UserGroupIcon width={25} /> Users
            </p>
            {roomUsers.map((user, i) => (
              <p key={i} className="flex gap-1 items-end my-2 text-sm">
                <UserIcon width={20} />
                {user.username === username ? "You" : user.username}
              </p>
            ))}
          </div>
          <button
            type="button"
            className="absolute bottom-0 p-2.5 flex gap-1 w-full mx-2 mb-5 items-center text-lg"
            onClick={leaveRoom}
          >
            {" "}
            <ArrowRightOnRectangleIcon width={25} />
            Leave Room
          </button>
        </div>
      </div>
      {/* right side */}
      <div className="w-full pt-5 relative ">
        <div className="h-[30rem] overflow-y-auto" ref={boxDivRef}>
          {receivedMessages.map((msg, i) => (
            <div
              key={i}
              className=" text-white bg-slate-600 px-3 py-2 w-3/4 mb-3 rounded-br-3xl rounded-tl-3xl"
            >
              <p className="text-sm font-medium font-mono">From {username}</p>
              <p className="text-lg font-medium break-words indent-5 mb-3">
                {msg.message}
              </p>
              <p className="text-sm font-mono font-medium text-right">
                {formatDistanceToNow(new Date(msg.sent_at))}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full flex items-end  my-5 py-2.4 px-2 ">
          <input
            type="text"
            placeholder="Type messages ..."
            className="w-full outline-none border-b text-lg me-2 focus:font-bold "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="button" onClick={sendMessage}>
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
