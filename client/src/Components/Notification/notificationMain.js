import { Slide, Card, Typography, makeStyles, IconButton } from "@material-ui/core";
import React, { useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { useAuth } from "../../Context/authStore";
import { useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom";
const useStyle = makeStyles({
  notification: {
    minWidth: "200px",
    width: "80%",
    maxWidth: "500px",
    height: "100px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    "& p": {
      fontSize: "18px",
      fontWeight: "500",
    },
  },
  textbox: {
    "& p": {
      color: "red",
    },
  },
});
const TextBox = ({ title, value }) => {
  const classes = useStyle();
  return (
    <div className={classes.textbox}>
      {/* <Typography>{title}</Typography> */}
      <Typography>{value}</Typography>
    </div>
  );
};
const NotificationMain = React.memo(() => {
  const { noti, setNoti, modiFriends } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const active_id = searchParams.get("chatID") ? searchParams.get("chatID") : null;
  // console.log(active_id);
  if (active_id !== null) {
    if (active_id.split("-")[0] === noti?.senderID || active_id.split("-")[1] === noti?.senderID) {
      setNoti(null);
    }
  }
  const Notification = () => {
    const classes = useStyle();
    // console.log(modiFriends, noti);
    const senderName = modiFriends?.find((el) => el.id === noti?.senderID)?.name;
    return (
      <>
        <Slide in={noti !== null} timeout={{ enter: 500, exit: 500 }} unmountOnExit>
          <Card className={classes.notification}>
            <IconButton onClick={() => setNoti(null)} style={{ background: "yellow" }}>
              <CloseIcon />
            </IconButton>
            <Typography>{senderName} has sent you a message</Typography>
            <TextBox value={noti?.chatArray[0].message} />
          </Card>
        </Slide>
      </>
    );
  };
  return <>{ReactDOM.createPortal(<Notification />, document.getElementById("notification"))}</>;
});
export default NotificationMain;
