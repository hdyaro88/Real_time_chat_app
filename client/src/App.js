import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardMain from "./Components/Dashboard/DashboardMain";
import ErrorMain from "./Components/ErrorBoundary/ErrorMain";
import Loading from "./Components/ErrorBoundary/Loading";
import LoginMain from "./Components/Login/Login";
import NotificationMain from "./Components/Notification/notificationMain";
import RegisterMain from "./Components/Register/RegisterMain";
import Routing from "./Components/Routes/Routes";
import { useAuth } from "./Context/authStore";
import { useUtility } from "./Context/utilityStore";
let initial = true;
const App = React.memo(({ setLoading, setError }) => {
  const { isLoggedIn, socket, noti } = useAuth();
  const { error, loading } = useUtility();
  useEffect(() => {
    return () => {
      console.log("app is terminating");
    };
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loading loading={loading} />
      <ErrorMain error={error} />
      {noti !== null && <NotificationMain />}
      <Routing isLoggedIn={isLoggedIn} />
    </div>
  );
});

export default App;
