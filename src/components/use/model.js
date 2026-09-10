import { Modal } from "react-bootstrap";

const UseModel = ({
  children,
  modelHeading = "",
  isCentered = false,
  showModel = true,
  handleModelClose,
  closeButton = true,
  backdrop = "",
  size = "",
}) => {
  return (
    <Modal
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered={isCentered}
      show={showModel}
      onHide={handleModelClose}
      backdrop={backdrop}
    >
      <Modal.Header closeButton={closeButton}>
        <Modal.Title id="contained-modal-title-vcenter">
          {modelHeading}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default UseModel;

UseModel.defaultProps = {
  handleModelClose: () => {},
};
