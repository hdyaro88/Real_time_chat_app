import { CircularProgress, Modal } from "@material-ui/core";

const Loader = ({ loading }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "600",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0 , 0 , 0 , 0.75)",
      }}
    >
      <CircularProgress />
    </div>
  );
};
export default Loader;
