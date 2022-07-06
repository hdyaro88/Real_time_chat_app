import axios from "axios";

export const searchQueryHandler = (query, setResults) => {
  if (query.trim().length === 0) {
    setResults(null);
    return;
  }
  axios
    .get(`/user?query=${query}`)
    .then((res) => {
      const matchedData = res.data.data.users;
      setResults(matchedData);
    })
    .catch((err) => {
      console.log(err);
    });
};

const confirmClients = (users, setFriends, socket) => {
  // console.log("emiiting");
  if (socket) socket.emit("confirm activity", { users, socket: socket.id });
  else {
    console.log("No socket alloted");
  }
};

////////////////////////////////////////////////////////////////

export const fetchFriends = (userData, setFriends, socket , setModiFriends) => {
  const local = localStorage.getItem("user_data");
  const friends = { friends: userData?.friends || JSON.parse(local).friends };
  // if (friends.friends?.length === 0) {
  //   return;
  // }
  // console.log(friends);
  axios
    .post("/user/", friends)
    .then((res) => {
      // console.log(res.data?.data?.modified);
      setFriends(res.data?.data?.modified);
      setModiFriends(res.data?.data?.modified);
      confirmClients(res.data?.data?.modified, setFriends, socket);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getName = async (id) => {
  let name;
  try {
    const res = await axios.post("/user/", { friends: [id] });
    if (res) {
      name = res.data.data.modified[0].name;
      return name;
    }
  } catch (err) {
    console.log(err);
  }
};
