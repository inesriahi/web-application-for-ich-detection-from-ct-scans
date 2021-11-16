import React from "react";

import { useSelector } from "react-redux";
import useImageUploader from "../../../hooks/useImageUploader";

const UploadForm = () => {

  const imgUploader = useImageUploader();

  const hiddenFileInput = React.useRef();

  const isClassificationLoading = useSelector(
    (state) => state.classification.isLoading
  );

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
          <button className={`upload disabled`}>
            <span style={{ fontSize: "15px", fontWeight: "300" }}>
              Wait until classification
              <br />
              is completed
            </span>
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
