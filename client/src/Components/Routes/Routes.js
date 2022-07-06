import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../../App";
import DashboardMain from "../Dashboard/DashboardMain";
import NoRoute from "../ErrorBoundary/404";
import LoginMain from "../Login/Login";
import RegisterMain from "../Register/RegisterMain";
const Routing = ({ isLoggedIn, setLoading }) => {
  return (
    <Routes>
      <Route path="/*" element={<LoginMain isLoggedIn={isLoggedIn} setLoading={setLoading} />}>
        <Route path="home" element={<DashboardMain setLoading={setLoading} />} />
        <Route path="*" element={<NoRoute />} />
      </Route>
      <Route path="/user/signup" element={<RegisterMain setLoading={setLoading} />} />
    </Routes>
  );
};
export default Routing;
