import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BodyCanvas = () => {
  const imgRef = useRef();
  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const [x_coor, setX_coor] = useState();
  const [y_coor, setY_coor] = useState();

  const scale = (number, inMin, inMax, outMin, outMax) => {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  // Find the actual coordinates of the clicked place in image
  const imgClickHandle = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x_client = e.clientX - rect.left;
    const y_client = e.clientY - rect.top;
    const original_width = imgRef.current.naturalWidth;
    const original_height = imgRef.current.naturalHeight;
    const current_width = imgRef.current.width;
    const current_height = imgRef.current.height;
    const mappedX = Math.round(scale(x_client, 0, current_width, 0, original_width))
    const mappedy = Math.round(scale(y_client, 0, current_height, 0, original_height))
    setX_coor(mappedX)
    setY_coor(mappedy)
    // console.log("x: " + x_client + " y: " + y_client);
    // console.log("Real Mapped Value X is::: " + scale(x_client, 0, current_width, 0, original_width))
    // console.log("Real Mapped Value Y is::: " + scale(y_client, 0, current_height, 0, original_height))
  };

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.addEventListener("mousedown", imgClickHandle);
    }

    return () => {
      if (imgRef.current)
        imgRef.current.removeEventListener("mousedown", imgClickHandle);
    };
  }, [imgRef.current]);

  return (
    <>
      {isLoadedImage && (<>
        <div className="brain-img">
          <img ref={imgRef} src={`data:image/png;base64,${loadedImg}`} />
        </div>
        {/* <p>
          X::: {x_coor},
          Y::: {y_coor}
        </p> */}
        </>
        
      )}
    </>
  );
};

export default BodyCanvas;
