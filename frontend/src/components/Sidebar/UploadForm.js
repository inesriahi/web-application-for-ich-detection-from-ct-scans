import React, { useState } from "react";
// import MetadataTable from "./components/MetadataTable";
import { Button } from "reactstrap";
import axios from "axios";
import { imgActions } from "../../store";
import MetadataModel from './MetadataModal/MetadataModal'
import { useDispatch, useSelector } from "react-redux";

const UploadForm = () => {
  const dispatch = useDispatch();

  const [img, setImg] = useState("");
  const [metadata, setMetadata] = useState({});
  const [showMetaModal, setShowMetaModal] = useState(false);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);

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
    <>
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
        <Button onClick={() => setShowMetaModal(true)}>Show MetaData</Button>
      )}
    </div>
    <MetadataModel setShowMetaModal = {setShowMetaModal} metadata = {metadata} showMetaModal={showMetaModal} />
    </>
  );
};

export default UploadForm;
