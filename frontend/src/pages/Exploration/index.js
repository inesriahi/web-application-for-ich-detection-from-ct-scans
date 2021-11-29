import React, { useState } from "react";
import { useSelector } from "react-redux";
import DragAndDrop from "../../components/Extensions/DragAndDrop";
import Annotation from "react-image-annotation-with-zoom/lib/components/Annotation";
import { PointSelector } from "react-image-annotation-with-zoom/lib/selectors";
import useImageUploader from "../../hooks/useImageUploader";

const Exploration = () => {
  const imgUploader = useImageUploader();

  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);

  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState({});

  // when the annotation is changed
  const onChange = (annotation) => {
    setAnnotation(annotation);
  };

  // when the annotation is submitted
  const onSubmit = (annotation) => {
    const { geometry, data } = annotation;
    setAnnotation({});
    setAnnotations((prevArray) => {
      return [
        ...prevArray,
        {
          geometry,
          data: {
            ...data,
            id: Math.random(),
          },
        },
      ];
    });
  };

  return (
    // Drag and drop if the image is not loaded, otherwise show the image
    <DragAndDrop
      active={!isLoadedImage}
      uploader={imgUploader}
      additionalClasses="explore"
    >
      <Annotation
        src={`data:image/png;base64,${loadedImg}`}
        alt="Two pebbles anthropomorphized holding hands"
        annotations={annotations}
        type={PointSelector.TYPE}
        value={annotation}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </DragAndDrop>
  );
};
export default Exploration;
