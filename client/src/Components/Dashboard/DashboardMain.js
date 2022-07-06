import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatboxMain from "../ChatBox/ChatboxMain";
import { Dimensions } from "../HelperFiles/Dimensions";
import SearchBar from "./SearchBar";
import UserPanel from "./Userpanel/UserPanel";
import UserPanelMobile from "./Userpanel/UserPanelMobile";
import { useAuth } from "../../Context/authStore";
import ProfileMain from "../Profile/ProfileMain";
import { Route, Routes, useLocation } from "react-router-dom";
import { maxString, minString } from "../ChatBox/Handlers";
import { getName } from "./Handlers";
const DashboardMain = () => {
  const { width } = Dimensions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeChat, setActiveChat] = useState({ chatID: null, status: true, name: null });
  const [addFriend, setAddFriend] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const active_id = searchParams.get("chatID") ? searchParams.get("chatID") : null;
  // console.log(user);
  useEffect(() => {
    if (active_id) {
      const s1 = active_id.split("-")[0],
        s2 = active_id.split("-")[1];
      const updateActiveChat = async () => {
        const name = s1 !== user?._id ? await getName(s1) : await getName(s2);
        setActiveChat((prev) => {
          return {
            ...prev,
            chatID: [minString(s1, s2), maxString(s1, s2)].join("-"),
            status: true,
            name: name,
          };
        });
      };
      updateActiveChat().catch((err) => console.log(err));
    }
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderLeft: "2px solid white",
        background: "#43d3c5",
      }}
    >
      <SearchBar />
      <Routes>
        <Route
          path="home/chat/*"
          element={
            <ChatboxMain
              setLoading={setLoading}
              loading={loading}
              activeChat={activeChat}
              userData={user}
              setActiveChat={setActiveChat}
            />
          }
        />
      </Routes>
      <Routes>
        <Route index path="/" element={<ProfileMain loading={loading} addFriend={setAddFriend} userData={user} />} />
      </Routes>

      {width >= 600 ? (
        <UserPanel
          activeChat={activeChat}
          setLoading={setLoading}
          userData={user}
          addFriend={addFriend}
          setActiveChat={setActiveChat}
        />
      ) : (
        <UserPanelMobile
          activeChat={activeChat}
          userData={user}
          setLoading={setLoading}
          addFriend={addFriend}
          setActiveChat={setActiveChat}
        />
      )}
    </div>
  );
};
export default DashboardMain;
