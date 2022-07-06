import { Modal, Slide } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useUtility } from "../../Context/utilityStore";
const ErrorMain = ({ error }) => {
  const { errorHandler } = useUtility();
  return (
    <Modal style={{ display: "flex", alignItems: "center", justifyContent: "center" }} open={error.status}>
      <Slide in={error.status}>
        <Alert onClose={() => errorHandler({ ...error, status: false })} security="warning">
          {error.message}
        </Alert>
      </Slide>
    </Modal>
  );
};
export default ErrorMain;
