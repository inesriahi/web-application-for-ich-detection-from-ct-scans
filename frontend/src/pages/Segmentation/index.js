import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ImageMarker from "./ImageMarker";
import { segmentedActions } from "../../store";
import axios from "axios";
import Toolbar from "../../components/Layout/Toolbar";
import { SEGMENT_URL } from "../../global/endpoints";
import RightSidebar from "../../components/Layout/RightSidebar";
import StatisticsTable from "./StatisticsTable";

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
  const [isSegmented, setIsSegmented] = useState(false);
  const [statistics, setStatistics] = useState([]);

  const sendMerkersArrayHandler = () => {
    axios
      .post(SEGMENT_URL, {
        coors: markersActualCoor,
        // img: {img: loadedImg, size: [imgRef.current.naturalWidth, imgRef.current.naturalHeight]},
      })
      .then((res) => {
        dispatch(segmentedActions.setImg(res.data.segmentation));
        dispatch(segmentedActions.setIsLoadedImg(true));
        setStatistics(JSON.parse(res.data.statistics));
        setIsSegmented(true);
      })
      .catch((err) => {
        console.log(err);
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
    },
  ];

  return (
    <>
      {isLoadedImage && <Toolbar tools={tools} />}
      {isSegmented && (
        <RightSidebar title="Texture Statistics">
          <div className="body">
            <div className="histogram"></div>
            <div className="table">
              <div>
                <StatisticsTable data={statistics} />
              </div>
            </div>
          </div>
        </RightSidebar>
      )}

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
    </>
  );
};

export default Segmentation;
