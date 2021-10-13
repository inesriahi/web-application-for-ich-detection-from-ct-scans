import React, { useState } from "react";
// import MetadataTable from "./components/MetadataTable";
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import axios from "axios";
import { imgActions } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import MetadataTable from "./MetadataModel/MetadataTable";

const UploadForm = () => {
  const dispatch = useDispatch();

  const [img, setImg] = useState("");
  const [metadata, setMetadata] = useState({});
  const [showMetaModel, setShowMetaModel] = useState(false);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const loadedImg = useSelector((state) => state.img.img);
  console.log(isLoadedImage);

  const newDocument = () => {
    const uploadData = new FormData();
    uploadData.append("dcmimg", img);
    axios
      .post("http://localhost:8000/api/documents/", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        // console.log(res.data.image);
        dispatch(imgActions.setImg(res.data.image));
        dispatch(imgActions.setIsLoadedImg(true));
        setMetadata(JSON.parse(res.data.metadata));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h3>Upload images with React</h3>
      <label>
        Image
        <input
          type="file"
          accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
          onChange={(event) => setImg(event.target.files[0])}
        />
      </label>
      <br />
      <Button className="outline-primary" onClick={() => newDocument()}>
        Upload Image
      </Button>

      {isLoadedImage && (
        <div className="brain-img">
          <img width="500" src={`data:image/png;base64,${loadedImg}`} />
        </div>
      )}

      {isLoadedImage && (
        <Button onClick={() => setShowMetaModel(true)}>Show MetaData</Button>
      )}

      <br />

      <Modal
        isOpen={showMetaModel}
        onHide={() => setShowMetaModel(false)}
        size="xl"
      >
        <ModalHeader closeButton>
          <h1>Dicom Metadata</h1>
        </ModalHeader>
        <ModalBody>
          <MetadataTable metadata={metadata} />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowMetaModel(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UploadForm;
