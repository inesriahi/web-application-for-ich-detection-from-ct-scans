import { useState } from "react";
import axios from "axios";
import MetadataTable from "./components/MetadataTable";
import { Button, Modal, ModalFooter, ModalHeader, ModalBody} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState("");
  const [metadata, setMetadata] = useState({});
  const [showMetaModel, setShowMetaModel] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const newDocument = () => {
    const uploadData = new FormData();
    uploadData.append("title", title);
    uploadData.append("dcmimg", img);
    axios
      .post("http://localhost:8000/api/documents/", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setImg(res.data.image);
        setIsImageLoaded(true);
        console.log(JSON.parse(res.data.metadata))
        setMetadata(JSON.parse(res.data.metadata));
      })
      .catch((err) => console.error(err));
  };
  return (
    <div>
      <h3>Upload images with React</h3>
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label>
        Image
        <input
          type="file"
          accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
          onChange={(event) => setImg(event.target.files[0])}
        />
      </label>
      <br />
      <Button variant="outline-primary" onClick={() => newDocument()}>
        Upload Image
      </Button>
      {isImageLoaded && (
        <Button onClick={() => setShowMetaModel(true)}>Show MetaData</Button>
      )}
      <br />

      {isImageLoaded && (
        <img width="500" src={`data:image/png;base64,${img}`} />
      )}

      <Modal isOpen={showMetaModel} onHide={() => setShowMetaModel(false)} size="xl">
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

      {/* {showMetaModel && isImageLoaded && <MetadataTable metadata = {metadata} />} */}
    </div>
  );
}

export default App;
