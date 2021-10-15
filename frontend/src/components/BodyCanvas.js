import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import ImageMarker from "./ImageMarker";

const CustomMarker = () => {
  return <div className="x-mark"></div>;
};

const BodyCanvas = () => {
  const imgRef = useRef();
  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const [marksArray, setMarksArray] = useState([]);
  const [markersActualCoor, setMarkersActualCoor] = useState([]);

  return (
    <>
      {isLoadedImage && (
        <div className="brain-img">
          <ImageMarker
            ref={imgRef}
            src={`data:image/png;base64,${loadedImg}`}
            markers={marksArray}
            onAddMarker={(marker) => {
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
              console.log(markersActualCoor);
            }}
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

export default BodyCanvas;
