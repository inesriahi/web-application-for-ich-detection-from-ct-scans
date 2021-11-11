import React from "react";
import { useSelector } from "react-redux";

const Exploration = () => {

  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  return <>
  {!isLoadedImage && <div class="image-container">Upload File</div>}
  {isLoadedImage && (
      <div className={`image-container ${isLoadedImage ? 'loaded' : ''}`}>
          <img src={`data:image/png;base64,${loadedImg}`}/>
      </div>
  )}
  </>;
};

export default Exploration;
