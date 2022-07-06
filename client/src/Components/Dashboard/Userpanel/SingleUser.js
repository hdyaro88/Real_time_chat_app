import { Avatar, Badge, Divider, Button, makeStyles, Paper, Typography, IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Dimensions } from "../../HelperFiles/Dimensions";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import users from "../../Data/users.json";
import { useDispatch } from "react-redux";
import { useAuth } from "../../../Context/authStore";
import axios from "axios";
import { fetchFriends } from "../Handlers";
import { useNavigate } from "react-router-dom";
import { getChatID } from "../../ChatBox/Handlers";
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
    transition: "all 0.2s",
  },
  online: {
    margin: "0.5rem",
    "& span": {
      padding: "0",
      minWidth: "10px",
      height: "10px",
      backgroundColor: "#00b548",
    },
  },
  offline: {
    margin: "0.5rem",
    "& span": {
      padding: "0",
      minWidth: "10px",
      height: "10px",
      backgroundColor: "red",
    },
  },
});
const SingleUser = React.memo(({ menu, name, setActive, activeChat, id, userID, setLoading, isOnline }) => {
  const classes = useStyle();
  const navigate = useNavigate();
  const { width } = Dimensions();
  const clickHandler = () => {
    const currentId = activeChat?.chatID || -1;
    setLoading(true);
    navigate(`/home/chat?chatID=${getChatID(id, userID)}`);
    setActive({ chatID: getChatID(id, userID), status: true, name: name });
  };
  return (
    <div style={{ width: "100%" }} onClick={clickHandler}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-around",
          cursor: "pointer",
          backgroundColor: "#36d0c2",
          color: "#ffffff",
        }}
      >
        <Badge
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          classes={{ root: isOnline ? classes.online : classes.offline }}
          overlap="circular"
          badgeContent=" "
        >
          <Avatar alt={name} src={`/user/profile_pic/${id}`} />
        </Badge>
        <div style={{ width: "80%" }}>
          <Typography style={{ fontWeight: "500", display: width >= 600 ? "" : menu ? "" : "none" }}>{name}</Typography>
        </div>
      </div>
      <Divider orientation="horizontal" />
    </div>
  );
});
export default SingleUser;
