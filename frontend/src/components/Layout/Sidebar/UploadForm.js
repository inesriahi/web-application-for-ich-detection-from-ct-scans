import React from "react";
import axios from "axios";
import {
  imgActions,
  segmentedActions,
  classificationActions,
} from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD_URL } from "../../../global/endpoints";

const UploadForm = () => {
  const dispatch = useDispatch();

  const hiddenFileInput = React.useRef();

  const isClassificationLoading = useSelector(
    (state) => state.classification.isLoading
  );

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
        dispatch(segmentedActions.setSegmentedImg(res.data.image));
        dispatch(segmentedActions.setIsSegmented(false));
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(segmentedActions.setIsLoading(false));
        dispatch(imgActions.setMetadata(JSON.parse(res.data.metadata)));

        dispatch(classificationActions.setIsClassified(false));
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
        {isClassificationLoading ? (
          <button
            className={`upload disabled`}
          >
            <span style={{fontSize: "15px", fontWeight: "300"}}>Wait until classification<br/>is completed</span>
          </button>
        ) : (
          <button
            className={`upload`}
            onClick={() => hiddenFileInput.current.click()}
          >
            <i className="fas fa-plus"></i>
            <span>Upload</span>
          </button>
        )}
        <span className="tool-tip">Upload</span>
      </li>
    </>
  );
};

export default UploadForm;
