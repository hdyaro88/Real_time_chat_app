import { makeStyles, IconButton, TextField, Avatar, Paper, Grow, Slide } from "@material-ui/core";
import { Dimensions } from "../HelperFiles/Dimensions";
import { Typography } from "@mui/material";
import SendIcon from "@material-ui/icons/Send";
import MessageData from "../Data/messages.json";
import React, { useEffect, useState } from "react";
import { fetchChats, MessageHandler, SortBy } from "./Handlers";
import Loading from "../ErrorBoundary/Loading";
import chatbg from "./chabg1.webp";
import Loader from "./Loading";
import { useAuth } from "../../Context/authStore";
const useStyle = makeStyles({
  root: {
    display: "flex",
    position: "absolute",
    height: "calc(100% - 50px - 1rem)",
    boxSizing: "border-box",
    top: "calc(1rem + 50px)",
    left: 0,
    zIndex: "50",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  send: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    overflow: "hidden",
    width: "90%",
    maxHeight: "50px",
    alignItems: "center",
    position: "absolute",
    zIndex: "100",
    backgroundColor: "aliceblue",
    bottom: "auto",
    left: "5%",
    "& .MuiFormControl-root": {
      width: "100%",
    },
    "& .MuiInputBase-root , input": {
      padding: "0 0 0 0.7rem",
      width: "100%",
    },
  },
  avatar: {
    width: "100px",
    height: "100px",
    margin: "auto 0.5rem",
  },
  messages: {
    overflow: "scroll",
    marginTop: "1rem",
    height: "calc(100% - 150px - 2rem)",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  singleMessage: {
    borderRadius: "20px",
    maxWidth: "100%",
    display: "flex",
    margin: "1rem 0.5rem",
    backgroundColor: "transparent",
    position: "relative",
  },
  thirdParty: {
    justifyContent: "flex-start",
    "&:before": {
      content: "''",
      width: "0px",
      position: "absolute",
      top: "5px",
      left: "-5px",
      height: "0px",
      borderTop: "10px solid transparent",
      borderBottom: "10px solid transparent",
      borderRight: "10px solid #c7a600",
    },
  },
  user: {
    justifyContent: "flex-end",
    "&:after": {
      content: "''",
      width: "0px",
      height: "0px",
      position: "absolute",
      top: "5px",
      right: "-5px",
      borderTop: "10px solid transparent",
      borderBottom: "10px solid transparent",
      borderLeft: "10px solid #13d675",
    },
  },
});

const SendBtn = ({ onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <SendIcon style={{ color: "#43d3c5" }} />
    </IconButton>
  );
};
const Message = ({ type, chat, userID }) => {
  const classes = useStyle();
  const styleClass = chat.senderID === userID ? classes.user : classes.thirdParty;
  const bg = chat.senderID === userID ? "#13d675" : "#c7a600";
  return (
    <Slide direction="up" in={true} timeout={{ enter: 200 }} mountOnEnter unmountOnExit>
      <Paper className={`${classes.singleMessage} ${styleClass}`} elevation={0}>
        <div
          style={{
            maxWidth: "90%",
            backgroundColor: bg,
            color: "#ffffff",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
          }}
        >
          <div style={{ width: "100%" }}>
            <Typography>{chat?.message}</Typography>
          </div>
        </div>
      </Paper>
    </Slide>
  );
};

const ChatboxMain = React.memo(({ setActiveChat, activeChat, userData, loading, setLoading }) => {
  const classes = useStyle();
  const { width: wid } = Dimensions();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setTyping] = useState(false);
  const [heTypes, setHeTypes] = useState(false);
  const [name, setName] = useState(activeChat?.name || null);
  const [whoTypes, setWhoTypes] = useState("");
  const { socket, confirmClients } = useAuth();
  const senderID = userData?._id;
  const reciverID =
    activeChat?.chatID?.split("-")[0] !== senderID
      ? activeChat?.chatID?.split("-")[0]
      : activeChat?.chatID?.split("-")[1];

  useEffect(() => {
    socket?.on("new message", (chatObject) => {
      console.log(chatObject);
      setChats((prev) => {
        if (prev) return [...prev, { ...chatObject.chatArray[0], _id: chatObject._id }];
        else return [{ ...chatObject.chatArray[0], _id: chatObject._id }];
      });
    });
    socket?.on("is Typing", (res) => {
      if (res.isTyping && !heTypes) {
        setHeTypes(true);
        setWhoTypes(res.senderID);
      } else {
        setHeTypes(false);
        setWhoTypes(null);
      }
    });
  }, [socket]);
  useEffect(() => {
    if (activeChat) {
      fetchChats(activeChat?.chatID, chats, setChats);
      setLoading(false);
      setName(activeChat?.name)
    }
    // return () => setActiveChat(null);
  }, [activeChat]);

  useEffect(() => {
    let tm;
    if (message) {
      if (!isTyping) setTyping(true);
      tm = setTimeout(() => {
        setTyping(false);
      }, 1500);
    }
    return () => clearTimeout(tm);
  }, [message]);
  useEffect(() => {
    socket?.emit("is Typing", { isTyping, senderID: senderID, recieverID: reciverID });
  }, [isTyping]);

  useEffect(() => {
    const element = document.getElementById("messageBox");
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [chats]);
  useEffect(() => {
    const element = document.getElementById("messageBox");
    if (heTypes && whoTypes === reciverID) element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [whoTypes]);

  return (
    <>
      <Grow in={activeChat?.status} unmountOnExit mountOnEnter>
        <div className={classes.root} style={{ width: wid >= 600 ? "calc(100% - 200px)" : "calc(100% - 60px)" }}>
          {loading && <Loader />}
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              backgroundImage: `url(${chatbg})`,
              backgroundSize: "cover",
              padding: "1rem 0",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              <Avatar
                src="https://img.icons8.com/color/144/000000/circled-user-male-skin-type-7--v2.png"
                className={classes.avatar}
              />
              <Typography style={{ fontSize: "18px", fontWeight: "600" }}>{name}</Typography>
            </div>
            <div id="messageBox" className={classes.messages} style={{ position: "relative" }}>
              {chats?.map((chat) => {
                return <Message key={chat._id} chat={chat} userID={userData._id} />;
              })}
              {heTypes && whoTypes === reciverID && (
                <Message key={1} chat={{ message: "...typing" }} userID={userData._id} />
              )}
            </div>
            <div className={classes.send}>
              <TextField
                placeholder="Type something..."
                variant="filled"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <SendBtn
                      onClick={() => {
                        setTyping(false);
                        MessageHandler(message, setChats, setMessage, senderID, reciverID, socket);
                      }}
                    />
                  ),
                  disableUnderline: true,
                }}
                onKeyPress={(e) =>
                  e.key === "Enter"
                    ? (setTyping(false), MessageHandler(message, setChats, setMessage, senderID, reciverID, socket))
                    : ""
                }
              />
            </div>
          </div>
        </div>
      </Grow>
    </>
  );
});
export default ChatboxMain;
