import React from "react";
import MetadataTable from "./MetadataTable";
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";

const MetadataModal = (props) => {
  return (
    <Modal
      isOpen={props.showMetaModal}
      onHide={() => props.setShowMetaModal(false)}
      size="xl"
    >
      <ModalHeader closeButton>
        <h1>Dicom Metadata</h1>
      </ModalHeader>
      <ModalBody>
        <MetadataTable metadata={props.metadata} />
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={() => props.setShowMetaModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MetadataModal;
