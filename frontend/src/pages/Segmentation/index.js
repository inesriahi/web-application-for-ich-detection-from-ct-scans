import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ImageMarker from "./ImageMarker";
import { segmentedActions } from "../../store";
import axios from "axios";
import Toolbar from "../../components/Layout/Toolbar";
import { SEGMENT_URL } from "../../global/endpoints";
import RightSidebar from "../../components/Layout/RightSidebar";
import StatisticsTable from "./StatisticsTable";
import Histogram from "./Histogram";

const CustomMarker = () => {
  return <div className="x-mark"></div>;
};

const Segmentation = () => {
  const dispatch = useDispatch();
  const imgRef = useRef();
  const originalImage = useSelector((state) => state.img.img);
  const isLoadedOriginalImage = useSelector((state) => state.img.isLoadedImg);

  const SegmentedImg = useSelector((state) => state.segmentation.img);
  const isLoadingSegmentation = useSelector(
    (state) => state.segmentation.isLoading
  );
  const isSegmented = useSelector((state) => state.segmentation.isSegmented);
  const marksArray = useSelector((state) => state.segmentation.marksArray);
  const markersActualCoor = useSelector(state => state.segmentation.markersActualCoor);
  const statistics = useSelector(state => state.segmentation.statistics);
  const histogram = useSelector(state => state.segmentation.histogram);

  const [isSelectingActive, setIsSelectingActive] = useState(false);


  const sendMerkersArrayHandler = () => {
    dispatch(segmentedActions.setIsLoading(true));
    axios
      .post(SEGMENT_URL, {
        coors: markersActualCoor,
      })
      .then((res) => {
        dispatch(segmentedActions.setSegmentedImg(res.data.segmentation));
        dispatch(segmentedActions.setIsLoading(false));
        dispatch(segmentedActions.setStatistics(JSON.parse(res.data.statistics)));
        dispatch(segmentedActions.setHistogram(JSON.parse(res.data.histogram)));
        dispatch(segmentedActions.setIsSegmented(true));
        dispatch(segmentedActions.setIsLoading(false));
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
      onClickHandler: () => {
        dispatch(segmentedActions.setMarksArray([]));
        dispatch(segmentedActions.setMarkersActualCoor([]));
        dispatch(segmentedActions.setSegmentedImg(originalImage));
      },
      disabled: marksArray.length === 0,
    },
    {
      name: "Undo",
      iconClass: "fas fa-undo",
      onClickHandler: () => {
        dispatch(segmentedActions.setMarksArray(marksArray.slice(0, -1)));
        dispatch(segmentedActions.setMarkersActualCoor(markersActualCoor.slice(0, -1)));
        },
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
      {isLoadedOriginalImage && !isLoadingSegmentation && (
        <Toolbar tools={tools} />
      )}
      {isSegmented && (
        <RightSidebar
          title="Texture Statistics"
          isDefaultOpen={false}
          openIconClass="far fa-chart-bar"
          openTooltip="Texture Anaylsis"
        >
          <div className="body">
            <div className="histogram">
              <Histogram data={histogram} />
            </div>
            <div className="table">
                <StatisticsTable data={statistics} />
            </div>
          </div>
        </RightSidebar>
      )}

      {!isLoadedOriginalImage && <div class="image-container">Upload File</div>}
      {isLoadedOriginalImage && (
        <div
          className="image-container loaded"
        >
          <ImageMarker
            ref={imgRef}
            src={`data:image/png;base64,${SegmentedImg}`}
            markers={marksArray}
            onAddMarker={
              isSelectingActive
                ? (marker) => {
                    if (imgRef.current) {
                      dispatch(segmentedActions.setMarkersActualCoor([...markersActualCoor, {
                        x: Math.round(
                          (marker.left * imgRef.current.naturalWidth) / 100
                        ),
                        y: Math.round(
                          (marker.top * imgRef.current.naturalHeight) / 100
                        ),
                      }]));
                      // setMarkersActualCoor((prevArray) => [
                      //   ...prevArray,
                      //   {
                      //     x: Math.round(
                      //       (marker.left * imgRef.current.naturalWidth) / 100
                      //     ),
                      //     y: Math.round(
                      //       (marker.top * imgRef.current.naturalHeight) / 100
                      //     ),
                      //   },
                      // ]);
                    }
                    dispatch(segmentedActions.setMarksArray([...marksArray, marker]));
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
