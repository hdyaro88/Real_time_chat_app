import { TextField, makeStyles, Button, Typography, Paper, Avatar, Slide } from "@material-ui/core";
import { SubmitHandler } from "./Handlers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import DashboardMain from "../Dashboard/DashboardMain";
import { useAuth } from "../../Context/authStore";
const useStyle = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    "& button": {
      margin: "1rem",
    },
  },
  avatar: {
    width: "100px",
    height: "100px",
    margin: "auto",
  },
  textfieldBox: {
    display: "flex",
    maxHeight: "500px",
    minWidth : "300px",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    "& .MuiFormControl-root": {
      width: "100%",
    },
  },
});
const LoginMain = ({ isLoggedIn, setLoading }) => {
  const classes = useStyle();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  return (
    <>
      {!isLoggedIn ? (
        <Slide in={true} direction="down" draggable>
          <Paper style={{ padding: "1rem" }}>
            <Avatar
              src="https://img.icons8.com/color/144/000000/circled-user-male-skin-type-7--v2.png"
              className={classes.avatar}
            />
            <form className={classes.root} onSubmit={login}>
              <div className={classes.textfieldBox}>
                <TextField type="email" style={{ margin: "0.7rem" }} label="Email" variant="outlined" />
                <TextField type="password" style={{ margin: "0.7rem" }} label="Password" variant="outlined" />
              </div>
              <div style={{ display: "flex", alignItems: "center", margin: "0.5rem" }}>
                <Typography>Don't have an accout?</Typography>
                <Button style={{ margin: 0 }} onClick={() => navigate("/user/signup")} variant="text" color="primary">
                  Sign Up
                </Button>
              </div>
              <Button type="submit" color="primary" variant="contained">
                Log In
              </Button>
            </form>
          </Paper>
        </Slide>
      ) : (
        <DashboardMain />
      )}
    </>
  );
};
export default LoginMain;
