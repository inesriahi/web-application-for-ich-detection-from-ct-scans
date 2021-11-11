import React from "react";
import axios from "axios";
import { imgActions, segmentedActions } from "../../../store";
import { useDispatch} from "react-redux";
import {UPLOAD_URL} from '../../../global/endpoints'

const UploadForm = () => {
  const dispatch = useDispatch();

  const hiddenFileInput = React.useRef();

  const imgUploader = (image) => {
    const uploadData = new FormData();
    uploadData.append("dcmimg", image);
    axios
      .post(UPLOAD_URL, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        // console.log(res.data.image);
        dispatch(imgActions.setImg(res.data.image));
        dispatch(segmentedActions.setImg(res.data.image));
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(segmentedActions.setIsLoadedImg(true));
        console.log("Metadata ", JSON.parse(res.data.metadata))
        dispatch(imgActions.setMetadata(JSON.parse(res.data.metadata)));
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
    </>
  );
};

export default UploadForm;
