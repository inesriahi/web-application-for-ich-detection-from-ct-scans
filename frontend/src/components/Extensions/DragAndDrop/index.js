import React from "react";
import useDragAndDrop from "../../../hooks/useDragAndDrop";
import useImageUploader from "../../../hooks/useImageUploader";

const DragAndDrop = (props) => {
  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError,
  } = useDragAndDrop();

  const uploader = props.uploader;

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 1) {
      return setFileDropError("Please Upload Only one Image!");
    }
    const selectedFile = e.dataTransfer.files[0];
    const fileExt =
      selectedFile.name.split(".")[selectedFile.name.split(".").length - 1];

    console.log(fileExt);
    if (fileExt !== "dicom" && fileExt !== "dcm") {
      return setFileDropError("Please Provide a Dicom File!");
    }

    uploader(selectedFile);
  };

  // const fileSelect = (e) => {
  //   let selectedFile = e.dataTransfer.files[0];

  //   if (selectedFile.type.split("/")[0] !== "image") {
  //     return setFileDropError("Please Provide an Image!");
  //   }
  //   setFileDropError("");
  // };

  return (
    <>
      {props.active && (
        <form
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <label
            htmlFor="file"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e)}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {props.active && (
              <>
                {!dragOver ? (
                  <>
                    <i
                      className="fas fa-cloud-upload-alt"
                      style={{
                        color: "grey",
                        fontSize: "50px",
                        marginBottom: "30px",
                        pointerEvents: "none",
                      }}
                    ></i>
                    <h3 style={{ color: "grey", pointerEvents: "none" }}>
                      Drag DICOM <br />
                      Image here!
                    </h3>
                  </>
                ) : (
                  <h1 style={{ color: "white", pointerEvents: "none" }}>Drop here...</h1>
                )}
                {fileDropError && (
                  <span className="file-drop-error" style={{ color: "red" }}>
                    {fileDropError}
                  </span>
                )}
              </>
            )}
          </label>
        </form>
      )}

      {!props.active && props.children}
    </>
  );
};

export default DragAndDrop;
