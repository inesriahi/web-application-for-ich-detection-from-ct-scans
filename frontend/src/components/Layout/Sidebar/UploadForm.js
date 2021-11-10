import React, { useState, useRef } from "react";
import { Button, Form } from "reactstrap";
import axios from "axios";
import { imgActions, segmentedActions } from "../../../store";
import MetadataModel from "./MetadataModal/MetadataModal";
import { FormGroup } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

const UploadForm = () => {
  const dispatch = useDispatch();

  const [img, setImg] = useState("");
  const [metadata, setMetadata] = useState({});
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const [windowCenter, setWindowCenter] = useState("");
  const [windowWidth, setWindowWidth] = useState("");

  const hiddenFileInput = React.useRef();

  const imgUploader = (image) => {
    const uploadData = new FormData();
    uploadData.append("dcmimg", image);
    // uploadData.append("windowCenter", windowCenter);
    // uploadData.append("windowWidth", windowWidth);
    axios
      .post("http://localhost:8000/api/documents/", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        // console.log(res.data.image);
        dispatch(imgActions.setImg(res.data.image));
        dispatch(segmentedActions.setImg(res.data.image));
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(segmentedActions.setIsLoadedImg(true));
        dispatch(imgActions.setMetadata(JSON.parse(res.data.metadata)));
      })
      .catch((err) => console.error(err));
  };

  const window_handler = () => {
    axios
      .post("http://localhost:8000/api/windowing/", {
        windowCenter: windowCenter,
        windowWidth: windowWidth,
      })
      .then((res) => {
        // console.log(res.data.image);
        dispatch(imgActions.setImg(res.data.image));
        dispatch(segmentedActions.setImg(res.data.image));
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(segmentedActions.setIsLoadedImg(true));
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <li>
        <input
          ref={hiddenFileInput}
          type="file"
          accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
          onChange={(event) => {
            imgUploader(event.target.files[0]);
          }}
          name="file"
        />
        <button
          className="upload"
          onClick={() => hiddenFileInput.current.click()}
        >
          <i className="fas fa-plus"></i>
          <span>Upload</span>
        </button>
        <span className="tool-tip">Upload</span>
      </li>

      {/* <Form>
        <FormGroup>
          <div class="input-group mb-3">
            <div class="custom-file">
              
              <label
                className="custom-file-label bg-dark text-white file-upload-field"
                for="inputGroupFile02"
              >
                {img && img.name}
                {!img && "Upload Image..."}
              </label>
            </div>
          </div>
          <Button block id="" className="mt-3" onClick={() => newDocument()}>
            Upload Image
          </Button>

          <div class="form-row">
            <div class="col">
              <input
                type="number"
                placeholder="Window Center"
                value={windowCenter}
                onChange={(e) => setWindowCenter(e.target.value)}
                className="form-control bg-dark text-white"
              />
            </div>
            <div class="col">
              <input
                type="number"
                className="form-control bg-dark text-white"
                placeholder="Window Width"
                value={windowWidth}
                onChange={(e) => setWindowWidth(e.target.value)}
              />
            </div>
          </div>
          <Button block id="" className="mt-3" onClick={() => window_handler()}>
            Update
          </Button>

          {isLoadedImage && (
            <Button block outline onClick={() => setShowMetaModal(true)}>
              Show MetaData
            </Button>
          )}
        </FormGroup>
      </Form> */}
      {/* <MetadataModel
        setShowMetaModal={setShowMetaModal}
        metadata={metadata}
        showMetaModal={showMetaModal}
      /> */}
    </>
  );
};

export default UploadForm;
