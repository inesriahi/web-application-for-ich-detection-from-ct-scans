import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DragAndDrop from "../../components/Extensions/DragAndDrop";
import Annotation from "react-image-annotation-with-zoom/lib/components/Annotation";
import { PointSelector } from "react-image-annotation-with-zoom/lib/selectors";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import { UPLOAD_URL } from "../../global/endpoints";
import axios from "axios";
import {
  imgActions,
  segmentedActions,
  classificationActions,
} from "../../store";

const Exploration = () => {
  const dispatch = useDispatch();
  const {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
    fileDropError,
    setFileDropError,
  } = useDragAndDrop();

  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);

  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState({});

  const onChange = (annotation) => {
    setAnnotation(annotation);
  };

  const onSubmit = (annotation) => {
    const { geometry, data } = annotation;
    setAnnotation({});
    setAnnotations((prevArray) => {
      return [
        ...prevArray,
        {
          geometry,
          data: {
            ...data,
            id: Math.random(),
          },
        },
      ];
    });
  };

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
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(imgActions.setMetadata(JSON.parse(res.data.metadata)));

        dispatch(segmentedActions.setSegmentedImg(res.data.image));
        dispatch(segmentedActions.setIsSegmented(false));
        dispatch(segmentedActions.setIsLoading(false));
        dispatch(segmentedActions.setMarksArray([]));
        dispatch(segmentedActions.setMarkersActualCoor([]));
        dispatch(segmentedActions.setHistogram([]));
        dispatch(segmentedActions.setStatistics([]));

        dispatch(classificationActions.setIsClassified(false));
      })
      .catch((err) => console.error(err));
  };

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

    imgUploader(selectedFile);
  };

  return (
    <>
      <div
        className={`image-container explore ${isLoadedImage ? "loaded" : ""}`}
        style={{ backgroundColor: "#000" }}
      >
        {!isLoadedImage && (
          <form>
            <label
              htmlFor="file"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e)}
              style={{ border: `${dragOver ? "3px dashed yellowgreen" : ""}` }}
            >
              {!isLoadedImage && (
                <div className="image-container">
                  {!dragOver ? (
                    <>
                      <i
                        className="fas fa-cloud-upload-alt"
                        style={{
                          color: "grey",
                          fontSize: "50px",
                          marginBottom: "30px",
                        }}
                      ></i>
                      <h3 style={{ color: "grey" }}>
                        Drag DICOM <br />
                        Image here!
                      </h3>
                    </>
                  ) : (
                    <h1 style={{ color: "white" }}>Drop here...</h1>
                  )}
                  {fileDropError && (
                    <span className="file-drop-error" style={{ color: "red" }}>{fileDropError}</span>
                  )}
                </div>
              )}
            </label>
          </form>
        )}
        {isLoadedImage && (
          <Annotation
            src={`data:image/png;base64,${loadedImg}`}
            alt="Two pebbles anthropomorphized holding hands"
            annotations={annotations}
            type={PointSelector.TYPE}
            value={annotation}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </>
  );
};
export default Exploration;
