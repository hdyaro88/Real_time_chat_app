import { makeStyles, Paper, Typography, IconButton, Divider } from "@material-ui/core";
import { useEffect, useState } from "react";
import Account from "@material-ui/icons/AccountCircle";
import { Dimensions } from "../../HelperFiles/Dimensions";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useAuth } from "../../../Context/authStore";
import { fetchFriends } from "../Handlers";
import SingleUser from "./SingleUser";
import { useNavigate } from "react-router-dom";
const useStyle = makeStyles({
  root: {
    maxWidth: "200px",
    width: "200px",
    position: "absolute",
    backgroundColor: "#43d3c5",
    zIndex: "100",
    top: "0",
    right: "0",
    height: "100%",
    transition: "all 0.5s",
    borderLeft: "2px solid #ffffff",
  },
  badge: {
    margin: "0.5rem",
    "& span": {
      padding: "0",
      minWidth: "15px",
      height: "15px",
      backgroundColor: "green",
    },
  },
});

const UserPanel = ({ activeChat, setActiveChat, userData, addFriend, setLoading }) => {
  const classes = useStyle();
  const { width: wid } = Dimensions();
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const { logout, socket, setModiFriends } = useAuth();
  // console.log(friends);
  useEffect(() => {
    // console.log(socket);
    if (socket?.connected) fetchFriends(userData, setFriends, socket, setModiFriends);
  }, [userData, socket, setModiFriends]);

  useEffect(() => {
    // console.log(friends);
    socket?.on("member activity change", (obj) => {
      setFriends((prev) => {
        const el = prev?.find((el) => el?.id === obj?.client_id);
        if (el) el.active = obj?.active;
        const modified = prev?.filter((elem) => elem?.id !== obj?.client_id);
        return [...modified, el];
      });
    });

    socket?.on("activity confirmed", (res) => {
      // console.log(res);
      if (res && Object.keys(res).length !== 0) setFriends(res);
    });
  }, [socket]);
  return (
    <Paper className={classes.root} style={{ width: wid >= 600 ? "30%" : "auto" }} elevation={0}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: "1rem",
            width: "80%",
            borderRadius: "20px",
            border: "1px solid black",
          }}
        >
          <Typography variant="h5" align="center">
            Friends
          </Typography>
        </div>
        <Divider style={{ margin: "1rem", background: "black", height: "1px" }} flexItem orientation="horizontal" />
        {friends?.map((user) => {
          return (
            <SingleUser
              key={user?.id}
              id={user?.id}
              userID={userData?._id}
              name={user?.name}
              setActive={setActiveChat}
              activeChat={activeChat}
              setLoading={setLoading}
              isOnline={user?.active}
            />
          );
        })}
        <div style={{ position: "absolute", bottom: "10px", margin: "auto" }}>
          <IconButton onClick={() => navigate("/")}>
            <Account fontSize="large" />
          </IconButton>
          <IconButton onClick={logout}>
            <ExitToAppIcon fontSize="large" />
          </IconButton>
        </div>
      </div>
    </Paper>
  );
};

export default UserPanel;
