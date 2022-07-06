import axios from "axios";

export const MessageHandler = async (message, setChats, setMessage, userID, friendID, socket) => {
  if (message.trim().length === 0) {
    return;
  }
  try {
    const chatObject = {
      senderID: userID,
      recieverID: friendID,
      chatArray: [
        {
          senderID: userID,
          message: message,
        },
      ],
    };
    const res = await axios.post("/home/chats", chatObject);
    if (res) {
      const newMessage = res.data.data.chat;
      setChats((prev) => (prev ? [...prev, newMessage] : [newMessage]));
      socket.emit("new message", { ...chatObject, _id: newMessage._id, socketId: socket.id });
      setMessage("");
    }
  } catch (err) {
    console.log(err);
  }
};

export const SortBy = (field) => {
  return (first, second) => {
    return first[field] > second[field] ? 1 : -1;
  };
};
export const minString = (string1, string2) => {
  if (string1 < string2) {
    return string1;
  } else {
    return string2;
  }
};
export const maxString = (string1, string2) => {
  if (string1 > string2) {
    return string1;
  } else {
    return string2;
  }
};

export const fetchChats = async (chatID , chats, setChats) => {
  try {
    const res = await axios.get(`/home/chats?chatID=${chatID}`);
    if (res) {
      if (
        chats?.length !== res.data?.data.chats[0]?.chatArray.length ||
        (res.data?.data.chats[0]?.chatArray.length > 0 && !chats)
      ) {
        setChats(res.data?.data?.chats[0]?.chatArray);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getChatID = (recieverID, senderID) => {
  const chatID = [minString(senderID, recieverID), maxString(senderID, recieverID)].join("-");
  return chatID;
};
