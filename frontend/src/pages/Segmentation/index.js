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
import DragAndDrop from "../../components/Extensions/DragAndDrop";
import useImageUploader from "../../hooks/useImageUploader";

const CustomMarker = () => {
  return <div className="x-mark"></div>;
};

const Segmentation = () => {
  const dispatch = useDispatch();
  const imgRef = useRef();

  // Load the necessary data from the redux store
  const originalImage = useSelector((state) => state.img.img);
  const isLoadedOriginalImage = useSelector((state) => state.img.isLoadedImg);

  const SegmentedImg = useSelector((state) => state.segmentation.img);
  const isLoadingSegmentation = useSelector(
    (state) => state.segmentation.isLoading
  );
  const isSegmented = useSelector((state) => state.segmentation.isSegmented);
  const marksArray = useSelector((state) => state.segmentation.marksArray);
  const markersActualCoor = useSelector(
    (state) => state.segmentation.markersActualCoor
  );
  const statistics = useSelector((state) => state.segmentation.statistics);
  const histogram = useSelector((state) => state.segmentation.histogram);

  // for managing the selection tool state
  const [isSelectingActive, setIsSelectingActive] = useState(false);

  // for when applying the segmentation, the markers array are sent to the server
  // and the segmentation is applied
  const sendMerkersArrayHandler = () => {
    dispatch(segmentedActions.setIsLoading(true));
    axios
      .post(SEGMENT_URL, {
        coors: markersActualCoor,
      })
      .then((res) => {
        dispatch(segmentedActions.setSegmentedImg(res.data.segmentation));
        dispatch(segmentedActions.setIsLoading(false));
        dispatch(
          segmentedActions.setStatistics(JSON.parse(res.data.statistics))
        );
        dispatch(segmentedActions.setHistogram(JSON.parse(res.data.histogram)));
        dispatch(segmentedActions.setIsSegmented(true));
        dispatch(segmentedActions.setIsLoading(false));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // create the tools that will be displayed in the toolbar with their corresponding onClick functions
  const tools = [
    {
      name: "Select Points",
      iconClass: "fas fa-hand-pointer",
      onClickHandler: () => setIsSelectingActive((previous) => !previous),
      isActive: isSelectingActive,
    },
    {
      name: "Reset",
      iconClass: "fas fa-sync",
      onClickHandler: () => {
        dispatch(segmentedActions.setIsSegmented(false));
        dispatch(segmentedActions.resetMarkers([]));
        dispatch(segmentedActions.setSegmentedImg(originalImage));
      },
      disabled: marksArray.length === 0,
    },
    {
      name: "Undo",
      iconClass: "fas fa-undo",
      onClickHandler: () => {
        dispatch(segmentedActions.undoMarker());
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
      {/*Show the toolbar only if the image is loaded*/}
      {isLoadedOriginalImage && !isLoadingSegmentation && (
        <Toolbar tools={tools} />
      )}
      {/*Show the segmented image and texture analysis info only 
      if the segmented image is loaded*/}
      {isSegmented && (
        // right sidebar with statistics and histogram
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

      {/* // Drag and drop if the image is not loaded, otherwise show the image */}
      <DragAndDrop
        active={!isLoadedOriginalImage}
        uploader={useImageUploader()}
      >
        {/* the image marker container */}
        <ImageMarker
          ref={imgRef}
          src={`data:image/png;base64,${SegmentedImg}`}
          markers={marksArray}
          onAddMarker={
            isSelectingActive
              ? (marker) => {
                  if (imgRef.current) {
                    dispatch(
                      segmentedActions.setMarkersActualCoor([
                        ...markersActualCoor,
                        {
                          x: Math.round(
                            (marker.left * imgRef.current.naturalWidth) / 100
                          ),
                          y: Math.round(
                            (marker.top * imgRef.current.naturalHeight) / 100
                          ),
                        },
                      ])
                    );
                  }
                  dispatch(
                    segmentedActions.setMarksArray([...marksArray, marker])
                  );
                }
              : undefined
          }
          extraClass="image-marker"
          markerComponent={CustomMarker}
          bufferLeft={0}
          bufferTop={0}
        />
      </DragAndDrop>
    </>
  );
};

export default Segmentation;
