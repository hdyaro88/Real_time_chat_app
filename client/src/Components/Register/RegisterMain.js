import { TextField, makeStyles, Button, Paper, Avatar } from "@material-ui/core";
import { useAuth } from "../../Context/authStore";
import { useNavigate } from "react-router-dom";
import { SubmitHandler } from "./Handlers";
import Slide from "@mui/material/Slide";
const useStyle = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    "& button": {
      margin: "2rem",
      marginBottom: "0",
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
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    "& .MuiFormControl-root": {
      width: "100%",
    },
  },
});
const RegisterMain = () => {
  const classes = useStyle();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  return (
    <Slide in={true} direction="down" draggable>
      <Paper style={{ padding: "1rem", minWidth: "300px" }}>
        <Avatar
          src="https://img.icons8.com/color/144/000000/circled-user-male-skin-type-7--v2.png"
          className={classes.avatar}
        />
        <form className={classes.root} onSubmit={signUp}>
          <div className={classes.textfieldBox}>
            <TextField style={{ margin: "0.7rem" }} label="Name" variant="outlined" />
            <TextField type="email" style={{ margin: "0.7rem" }} label="Email" variant="outlined" />
            <TextField type="password" style={{ margin: "0.7rem" }} label="Password" variant="outlined" />
            <TextField type="password" style={{ margin: "0.7rem" }} label="Confirm Password" variant="outlined" />
          </div>
          <Button type="submit" color="primary" variant="contained">
            Sign Up
          </Button>

          <Button onClick={() => navigate("/login")} variant="text" color="primary" size="small">
            Back to Login
          </Button>
        </form>
      </Paper>
    </Slide>
  );
};
export default RegisterMain;
