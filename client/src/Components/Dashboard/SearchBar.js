import { IconButton, makeStyles, Paper, TextField, Typography, Avatar, ClickAwayListener } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import { Badge, Divider } from "@material-ui/core";
import { useEffect, useState, useRef } from "react";
import { Dimensions } from "../HelperFiles/Dimensions";
import { searchQueryHandler } from "./Handlers";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
// import { Slide } from "@material-ui/core";
const useStyle = makeStyles({
  search: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    overflow: "hidden",
    width: "90%",
    maxHeight: "50px",
    alignItems: "center",
    backgroundColor: "#ffffff",
    "& .MuiFormControl-root": {
      width: "100%",
    },
    "& .MuiInputBase-root , input": {
      padding: "0 0 0 0.7rem",
      width: "100%",
    },
  },
  results: {
    width: "80%",
  },
});
const SearchBtn = () => {
  return (
    <IconButton style={{}}>
      <SearchOutlined />
    </IconButton>
  );
};

const SingleUser = ({ name, id }) => {
  const classes = useStyle();
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate(`/home/profile?id=${id}`);
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
          padding: "0.2rem 0",
        }}
      >
        <Avatar />
        <div style={{ width: "80%" }}>
          <Typography>{name}</Typography>
        </div>
      </div>
      <Divider orientation="horizontal" />
    </div>
  );
};
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { width: wid } = Dimensions();
  const [results, setResults] = useState([]);
  const queryBox = useRef();
  const classes = useStyle();
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
    } else {
      searchQueryHandler(query, setResults);
    }
  }, [query]);
  return (
    <ClickAwayListener onClickAway={() => searchQueryHandler("", setResults)}>
      <div
        ref={queryBox}
        style={{
          display: "flex",
          position: "absolute",
          paddingTop: "1rem",
          top: 0,
          left: 0,
          zIndex: "70",
          width: wid >= 600 ? "calc(100% - 200px)" : "calc(100% - 60px)",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div className={classes.search}>
          <TextField
            // style={{width : "80%"}}
            placeholder="Search for your friend"
            variant="filled"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ endAdornment: <SearchBtn />, disableUnderline: true }}
          />
        </div>
        {results?.length > 0 && (
          <Slide
            direction="down"
            in={Boolean(query.trim().length)}
            container={queryBox.current}
            timeout={{ enter: 300, exit: 200 }}
          >
            <Paper className={classes.results}>
              {results?.map((user) => {
                return <SingleUser key={user._id} id={user._id} name={user.name} />;
              })}
            </Paper>
          </Slide>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;
