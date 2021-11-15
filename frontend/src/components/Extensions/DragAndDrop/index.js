import React, { useState } from "react";
import useDragAndDrop from "../../../hooks/useDragAndDrop";

const DragAndDrop = () => {
  const [file, setFile] = useState();
  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError,
  } = useDragAndDrop();

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if ( e.dataTransfer.files &&  e.dataTransfer.files.length > 1) {
        return setFileDropError("Please Upload Only one Image!");
    }
    const selectedFile = e.dataTransfer.files[0];
    const fileExt = selectedFile.name.split(".")[selectedFile.name.split(".").length - 1]

    console.log(fileExt)
    if (fileExt !== "dicom" && fileExt !== "dcm") {
      return setFileDropError("Please Provide a Dicom File!");
    }

    setFile(selectedFile);
  };

  const fileSelect = (e) => {
    let selectedFile = e.dataTransfer.files[0];

    if (selectedFile.type.split("/")[0] !== "image") {
      return setFileDropError("Please Provide an Image!");
    }
    setFileDropError("");
  };

  return (
    <div className="container">
      <form>
        {fileDropError && (
          <span className="file-drop-error">{fileDropError}</span>
        )}
        <label
          htmlFor="file"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e)}
          style={{ border: `${dragOver ? "3px dashed yellowgreen" : ""}` }}
        >
          {file && <h1>{file.name}</h1>}
          {!file && (
            <h1 style={{ color: `${dragOver ? " yellowgreen" : ""}` }}>
              {!dragOver ? "Select Or Drop your File here..." : "Drop here..."}
            </h1>
          )}
        </label>
        {/* <input type="file" name="file" id="file" onChange={fileSelect} /> */}
      </form>
    </div>
  );
};

export default DragAndDrop;
