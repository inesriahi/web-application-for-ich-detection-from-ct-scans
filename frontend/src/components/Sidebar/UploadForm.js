import React, { useState } from "react";
import { Button, Form } from "reactstrap";
import axios from "axios";
import { imgActions } from "../../store";
import MetadataModel from "./MetadataModal/MetadataModal";
import { FormGroup } from "reactstrap";
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
      <Form>
        <FormGroup>
          <h3>Upload images with React</h3>
          <div class="input-group mb-3">
            <div class="custom-file">
              <input
                type="file"
                accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
                onChange={(event) => setImg(event.target.files[0])}
                class="custom-file-input"
                id="inputGroupFile02"
              />
              <label class="custom-file-label" for="inputGroupFile02">
                {img && img.name}
                {!img && "Upload Image..."}
              </label>
            </div>
          </div>

          {/* Setting window center and window width*/}
          <div class="form-row">
            <div class="col">
              <input
                type="number"
                class="form-control"
                placeholder="Window Center"
              />
            </div>
            <div class="col">
              <input
                type="number"
                class="form-control"
                placeholder="Window Width"
              />
            </div>
          </div>

          <Button block id="" className="mt-3" onClick={() => newDocument()}>
            Upload Image
          </Button>

          {isLoadedImage && (
            <Button block outline onClick={() => setShowMetaModal(true)}>
              Show MetaData
            </Button>
          )}
        </FormGroup>
      </Form>
      <MetadataModel
        setShowMetaModal={setShowMetaModal}
        metadata={metadata}
        showMetaModal={showMetaModal}
      />
    </>
  );
};

export default UploadForm;
