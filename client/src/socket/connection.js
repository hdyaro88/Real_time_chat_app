import io from "socket.io-client";
let socket = null;

export const connectSocket = (userDetails, setSocket, setNoti) => {
  socket = io();
  console.log(socket);
  socket.on("connect", () => {
    console.log("Connection successfull to the socket server");
    socket.emit("new connection", { user_id: userDetails._id, socket_id: socket.id, friends: userDetails.friends });
    setSocket(socket);
    socket.on("new message", (chatObject) => {
      // console.log(chatObject);
      setNoti(chatObject);
    });
  });
};
