import { CircularProgress, Modal } from "@material-ui/core";

const Loading = ({ loading }) => {
  return (
    <Modal
      open={loading.status}
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "900",
      }}
    >
      <CircularProgress />
    </Modal>
  );
};
export default Loading;
