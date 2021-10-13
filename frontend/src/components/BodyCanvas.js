import React from "react";
import { useSelector } from "react-redux";

const BodyCanvas = () => {
  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  return (
    <>
      {isLoadedImage && (
        <div className="brain-img">
          <img src={`data:image/png;base64,${loadedImg}`} />
        </div>
      )}
    </>
  );
};

export default BodyCanvas;
