import { Avatar, Badge, Divider, Button, makeStyles, Paper, Typography, IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import Account from "@material-ui/icons/AccountCircle";
import { Dimensions } from "../../HelperFiles/Dimensions";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import users from "../../Data/users.json";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../Context/authStore";
import axios from "axios";
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
const UserPanelMobile = React.memo(({ activeChat, setActiveChat, userData, addFriend, setLoading }) => {
  const classes = useStyle();
  const { width } = Dimensions();
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(null);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const { logout, socket, setModiFriends } = useAuth();

  useEffect(() => {
    // console.log(socket);
    if (socket?.connected) fetchFriends(userData, setFriends, socket, setModiFriends);
  }, [userData, addFriend, socket]);

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
    <>
      <Paper className={classes.root} style={{ width: menu ? "200px" : "60px" }} elevation={0}>
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
              display: "flex",
              alignItems: "center",
              margin: "2rem",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            {menu ? (
              <>
                <CloseIcon onClick={() => setMenu(false)} />
                <Typography variant="h5" align="center">
                  Friends
                </Typography>
              </>
            ) : (
              <Menu onClick={() => setMenu(true)} />
            )}
          </div>
          {friends?.map((user) => {
            return (
              <SingleUser
                key={user.id}
                menu={menu}
                id={user.id}
                userID={userData._id}
                name={user?.name}
                setActive={setActiveChat}
                activeChat={activeChat}
                setLoading={setLoading}
                isOnline={user.active}
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
    </>
  );
});
export default UserPanelMobile;
