import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import ImageMarker from "./ImageMarker";
import {imgActions} from '../../store'
import axios from "axios";

const CustomMarker = () => {
  return <div className="x-mark"></div>;
};

const BodyCanvas = () => {
  const dispatch = useDispatch()
  const imgRef = useRef();
  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const [marksArray, setMarksArray] = useState([]);
  const [markersActualCoor, setMarkersActualCoor] = useState([]);

  const sendMerkersArrayHandler = () => {
    axios
      .post("http://localhost:8000/api/segment/", {
        coors: markersActualCoor,
        img: {img: loadedImg, size: [imgRef.current.naturalWidth, imgRef.current.naturalHeight]},
      })
      .then((res) => {
        dispatch(imgActions.setImg(res.data.segmentation))
        console.log(res.data.segmentation)
      });
  };

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

      <Button block outline onClick={sendMerkersArrayHandler}>
        Segment
      </Button>
    </>
  );
};

export default BodyCanvas;
