const registerSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  let activeClients = [];
  const fetchClient = (user_id) => {
    const client = activeClients.find((el) => el.user_id === user_id);
    // console.log(client);
    return client?.socket_id;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////

  io.on("connection", (socket) => {
    console.log("Socket io connected", socket.id);
    ////////////////////////////////////////////////////////////////////////////////////////////

    socket.on("new connection", (user) => {
      console.log("new connection");
      const existed = activeClients.findIndex((el) => el.user_id === user.user_id);
      if (existed === -1) {
        activeClients.push({ user_id: user.user_id, socket_id: user.socket_id });
      } else {
        activeClients[existed] = { ...activeClients[existed], socket_id: user.socket_id };
      }
      // console.log(user);
      user?.friends?.map((frnd) => {
        const socket_id = fetchClient(frnd);
        // if(socket_id) console.log(socket_id);
        if (socket_id) io.to(socket_id).emit("member activity change", { client_id: user?.user_id, active: true });
      });
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on("new message", (chatObject) => {
      console.log("new message");
      const socket_id = fetchClient(chatObject.recieverID);
      io.to(socket_id).emit("new message", chatObject);
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on("is Typing", (res) => {
      const socket_id = fetchClient(res.recieverID);
      if (socket_id) {
        io.to(socket_id).emit("is Typing", res);
      }
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on("confirm activity", (obj) => {
      // console.log(obj);
      const friends = [];
      obj.users?.forEach((user) => {
        if (activeClients.findIndex((el) => el.user_id === user.id) !== -1) {
          friends.push({ active: true, ...user });
        } else {
          friends.push({ active: false, ...user });
        }
      });
      io.to(obj.socket).emit("activity confirmed", friends);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    socket.on("kill", (obj) => {
      // console.log(obj);
      console.log("socket to be disconnected", obj.socket_id);
      const client = activeClients.find((el) => el.socket_id === obj.socket_id);
      io.sockets.sockets.forEach((socket) => {
        // If given socket id is exist in list of all sockets, kill it
        if (socket.id === obj.socket_id) {
          socket.disconnect(true);
          activeClients = activeClients.filter((el) => el.socket_id !== obj.socket_id);
        }
        // console.log(activeClients);
      });
      obj.friends.map((frnd) => {
        const socket_id = fetchClient(frnd);
        // console.log(socket_id);
        if (socket_id) io.to(socket_id).emit("member activity change", { client_id: client?.user_id, active: false });
      });
    });
  });

  return io;
};

module.exports = { registerSocket };
