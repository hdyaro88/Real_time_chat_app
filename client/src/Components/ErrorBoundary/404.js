import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const NoRoute = () => {
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate("/");
    localStorage.clear();
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Button onClick={() => clickHandler()}>Homepage</Button>
    </div>
  );
};

export default NoRoute;
