import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BoxLoading } from "react-loadingg";

import { HEADER } from "../../global/constants";
import { CLASSIFY_URL } from "../../global/endpoints.js";

import ResultItem from "./ResultItem.js";
import RightSidebar from "../../components/Layout/RightSidebar/index.js";
import LoadingContainer from "../../components/Extensions/LoadingContainer.js";
import { classificationActions } from "../../store/index.js";
import DragAndDrop from "../../components/Extensions/DragAndDrop";
import useImageUploader from "../../hooks/useImageUploader";

const Classification = () => {
  const dispatch = useDispatch();
  const imgUploader = useImageUploader();

  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const binaryPred = useSelector((state) => state.classification.binaryPred);
  const multiPred = useSelector((state) => state.classification.multiPred);
  const isClassificationLoading = useSelector(
    (state) => state.classification.isLoading
  );
  const isClassificationClassified = useSelector(
    (state) => state.classification.isClassified
  );

  const classifyHandler = () => {
    // Send a request to the server to classify the image
    dispatch(classificationActions.setIsLoading(true));

    axios
      .post(CLASSIFY_URL)
      .then((res) => {
        const data = res.data;
        dispatch(classificationActions.setBinaryPred(data.binaryPred[0]));
        dispatch(
          classificationActions.setMultiPred(
            data.multiPred ? data.multiPred[0] : null
          )
        );
        dispatch(classificationActions.setIsLoading(false));
        dispatch(classificationActions.setIsClassified(true));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const l = [];
  if (multiPred) {
    for (let i = 0; i < multiPred.length; i++) {
      l.push(<ResultItem key={i} name={HEADER[i]} percent={multiPred[i]} />);
    }
  }

  return (
    <>
      {isLoadedImage && (
        <RightSidebar
          title="Classification Results"
          isDefaultOpen={true}
          openTooltip="Classification Results"
          openIconClass="fas fa-percentage"
          width="400px"
        >
          {/* Display classification button when it not loading and not classified */}
          {isClassificationLoading && !isClassificationClassified && (
            <LoadingContainer text="Classifying...">
              <BoxLoading color="#fff" style={{ position: "relative" }} />
            </LoadingContainer>
          )}
          {!isClassificationLoading && !isClassificationClassified && (
            <button className="_btn" onClick={classifyHandler}>
              Start Classification
            </button>
          )}
          {!isClassificationLoading && isClassificationClassified && (
            <ul className="classification-list">
              <ResultItem name="Abnormality" percent={binaryPred} />
              {l.length > 0 ? l : null}
            </ul>
          )}
        </RightSidebar>
      )}

        <DragAndDrop active={!isLoadedImage} uploader={imgUploader}>
          {isLoadedImage && (
            <img src={`data:image/png;base64,${loadedImg}`} alt="DICOM file" />
          )}
        </DragAndDrop>

    </>
  );
};

export default Classification;
