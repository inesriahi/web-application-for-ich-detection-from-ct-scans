import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import ImageMarker from "./ImageMarker";
import { segmentedActions } from "../../store";
import axios from "axios";
import Toolbar from "../../components/Layout/Toolbar";

const CustomMarker = () => {
  return <div className="x-mark"></div>;
};

const Segmentation = () => {
  const dispatch = useDispatch();
  const imgRef = useRef();
  const loadedImg = useSelector((state) => state.segmentation.img);
  const isLoadedImage = useSelector((state) => state.segmentation.isLoadedImg);
  const [marksArray, setMarksArray] = useState([]);
  const [markersActualCoor, setMarkersActualCoor] = useState([]);
  const [isSelectingActive, setIsSelectingActive] = useState(false);

  const sendMerkersArrayHandler = () => {
    axios
      .post("http://localhost:8000/api/segment/", {
        coors: markersActualCoor,
        // img: {img: loadedImg, size: [imgRef.current.naturalWidth, imgRef.current.naturalHeight]},
      })
      .then((res) => {
        dispatch(segmentedActions.setImg(res.data.segmentation));
        dispatch(segmentedActions.setIsLoadedImg(true));
        console.log(res.data.segmentation);
      });
  };

  // create an object with name and iconClass props
  const tools = [
    {
      name: "Select Points",
      iconClass: "fas fa-hand-pointer",
      onClickHandler: () => setIsSelectingActive((previous) => !previous),
      isActive: isSelectingActive,
    },
    // TODO: Add returning the not segmented image besides resetting the array
    {
      name: "Reset",
      iconClass: "fas fa-sync",
      onClickHandler: () => setMarksArray([]),
      disabled: marksArray.length === 0,
    },
    {
      name: "Undo",
      iconClass: "fas fa-undo",
      onClickHandler: () =>
        setMarksArray((prevArray) => prevArray.slice(0, prevArray.length - 1)),
      disabled: marksArray.length === 0,
    },
    {
      name: "Apply Segmentation",
      iconClass: "fas fa-check-circle",
      onClickHandler: sendMerkersArrayHandler,
      disabled: marksArray.length === 0,
    }
  ];

  return (
    <>
      {isLoadedImage && <Toolbar tools={tools} />}
      {!isLoadedImage && <div class="image-container">Upload File</div>}
      {isLoadedImage && (
        <div className={`image-container ${isLoadedImage ? "loaded" : ""}`}>
          <ImageMarker
            ref={imgRef}
            src={`data:image/png;base64,${loadedImg}`}
            markers={marksArray}
            onAddMarker={
              isSelectingActive
                ? (marker) => {
                    if (imgRef.current) {
                      setMarkersActualCoor((prevArray) => [
                        ...prevArray,
                        {
                          x: Math.round(
                            (marker.left * imgRef.current.naturalWidth) / 100
                          ),
                          y: Math.round(
                            (marker.top * imgRef.current.naturalHeight) / 100
                          ),
                        },
                      ]);
                    }
                    setMarksArray([...marksArray, marker]);
                  }
                : undefined
            }
            extraClass="image-marker"
            markerComponent={CustomMarker}
            bufferLeft={0}
            bufferTop={0}
          />
        </div>
      )}
{/* 
      {marksArray.length > 0 && (
        <Button block outline onClick={sendMerkersArrayHandler}>
          Segment
        </Button>
      )} */}
    </>
  );
};

export default Segmentation;
