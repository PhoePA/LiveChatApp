import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const Welcome = ({ username, setUsername, room, setRoom, setSocket }) => {
  const navigate = useNavigate();
  const joinRoom = (e) => {
    e.preventDefault();
    if (
      username.trim().length > 0 &&
      room !== "select" &&
      room.trim().length > 0
    ) {
      const socket = io.connect("http://localhost:4000");
      setSocket(socket);
      navigate("/room", { replace: true });
    } else {
      alert("Please Fill All the User Info!");
    }
  };
  return (
    <section className="flex flex-col justify-center items-center h-screen bg-slate-100">
      <h1 className=" h-1/6 text-5xl font-bold outline-lime-500 ">
        Welcome To Our Live Chat
      </h1>
      <div className=" w-96 h-2/8 bg-zinc-200 p-4 text-neutral-700 rounded-lg border-emerald-500 border-2">
        <div className="mb-6 ">
          <p className="uppercase font-bold text-center text-2xl">
            LiveChat.io
          </p>
        </div>
        <form
          action=""
          className="items-center text-center"
          onSubmit={joinRoom}
        >
          <div className="mb-3 ">
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="p-2.5 border-2 border-emerald-500 w-full text-base font-medium rounded-lg outline-none hover:font-bold"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <select
              name="room"
              id="room"
              className="text-center rounded-lg border-2 border-emerald-500 w-full text-base font-bold p-2.5 focus:ring-neutral-500"
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="select">--- Select Room ---</option>
              <option value="React">React</option>
              <option value="NodeJs">NodeJs</option>
              <option value="JavaScript">JavaScript</option>
            </select>
          </div>
          <button
            type="submit"
            className="mb-3 w-content border-2 border-emerald-500 p-2 rounded-lg hover:bg-gray-300 font-bold"
          >
            Join Room
          </button>
        </form>
      </div>
    </section>
  );
};

export default Welcome;
