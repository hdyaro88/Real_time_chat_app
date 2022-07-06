import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useUtility } from "./utilityStore";
import { connectSocket } from "../socket/connection";
const AuthContext = React.createContext();
let firstLoad = true;
export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthHandler = ({ children, history }) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const { loadingHandler, errorHandler } = useUtility();
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [noti, setNoti] = useState(null);
  const [modiFriends, setModiFriends] = useState([]);
  const navigate = useNavigate();

  ///////////////////////////////////////////////////////////
  const login = async (event) => {
    event.preventDefault();
    loadingHandler({ status: true, message: "Please wait.." });
    const loginCredential = { email: event.target[0].value, password: event.target[2].value };
    try {
      const res = await axios.post("/user/login", loginCredential);

      const token = res.data.token;
      setUser(res.data.data.user);
      await connectSocket(res.data.data.user, setSocket, setNoti);
      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(res.data?.data?.user));
      setisLoggedIn(true);
      navigate("/");
      loadingHandler({ status: false, message: "Please wait.." });
    } catch (err) {
      errorHandler({ status: true, message: err.response.data.message });
      // console.log(err.response.data.message);
      loadingHandler({ status: false, message: "Please wait.." });
    }
  };

  ///////////////////////////////////////////////////////////
  const logout = () => {
    loadingHandler({ status: true, message: "Please wait.." });
    setisLoggedIn(false);
    socket?.emit("kill", { socket_id: socket?.id, friends: user?.friends });
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    navigate("/");
    loadingHandler({ status: false, message: "Please wait.." });
  };

  /////////////////////////////////////////////////////////
  const update = async () => {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    // console.log(userData);
    try {
      const res = await axios.get(`/user?id=${userData._id}`);
      if (res) {
        console.log(res.data);
        return res.data?.data?.users[0];
      }
    } catch (err) {
      console.log(err);
    }
  };

  //////////////////////////////////////////////////////////
  const signUp = async (event) => {
    event.preventDefault();
    console.log(event);
    loadingHandler({ status: true, message: "Please wait.." });
    const signUpCredential = {
      name: event.target[0].value,
      email: event.target[2].value,
      password: event.target[4].value,
      confirmPassword: event.target[6].value,
    };
    try {
      const res = await axios.post("/user/signup", signUpCredential);
      const token = res.data.token;

      setisLoggedIn(true);
      setUser(res.data.data.user);
      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(res.data?.data?.user));
      navigate("/home/profile");

      loadingHandler({ status: false, message: "Please wait.." });
    } catch (err) {
      console.log(err.toString());
      errorHandler({ status: true, message: err.response.data.message });
      loadingHandler({ status: false, message: "Please wait.." });
    }
  };

  ///////////////////////////////////////////////////////////

  const confirmClients = () => {
    socket?.emit("confirm activity", { users: user.friends, socket: socket.id });
    socket?.on("activity confirmed", (res) => {
      setUser((prev) => {
        prev.friends = res;
      });
    });
  };

  ///////////////////////////////////////////////////////////
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLoggedIn(true);
      const asUpdate = async () => {
        try {
          const data = await update();
          if (firstLoad) {
            console.log(firstLoad);
            setUser(data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      asUpdate().catch((err) => console.log(err));
      const userData = JSON.parse(localStorage.getItem("user_data"));
      connectSocket(userData, setSocket, setNoti);
      if (firstLoad) {
        console.log(firstLoad);
        setUser(userData);
        firstLoad = false;
      }
    }
  }, []);
  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    signUp,
    update,
    confirmClients,
    socket,
    noti,
    setNoti,
    modiFriends,
    setModiFriends,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
