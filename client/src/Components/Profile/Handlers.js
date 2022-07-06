import axios from "axios";
import { useAuth } from "../../Context/authStore";

export const fetchUsers = (userId, setProfile) => {
  axios
    .get(`/user?id=${userId}`)
    .then((res) => {
      const matchedData = res.data.data.users[0];
      setProfile(matchedData);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addFriendHandler = (friendID, userID, addFriend, userData, update) => {
  userData.friends.push(friendID);
  // console.log(userData);
  addFriend(friendID);
  axios
    .post("/user/addFriend", { id: userID, addFriend: friendID })
    .then((res) => {
      // console.log(res.data);
      update();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const profile_pic_uploadHandler = async (profile_pic, setPic, userData) => {
  if (profile_pic.size > 2097152) {
    alert("File is too big!");
    return;
  }
  setPic(profile_pic);
  try {
    var bodyFormData = new FormData();
    bodyFormData.append("file", profile_pic);
    const res = await axios({
      method: "post",
      url: `/user/profile_pic/${userData._id}`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
};
