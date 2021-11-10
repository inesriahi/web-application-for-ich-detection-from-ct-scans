import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const Exploration = () => {
  const imgRef = useRef();
  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  return <>
  {isLoadedImage && (
      <div className="brain-img">
          <img src={`data:image/png;base64,${loadedImg}`}/>
      </div>
  )}
  </>;
};

export default Exploration;
