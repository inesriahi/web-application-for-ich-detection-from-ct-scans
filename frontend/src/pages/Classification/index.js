import React from "react";
import { useSelector } from "react-redux";
import RightPopup from "../../components/Layout/RightPopup.js";
import ResultItem from "./ResultItem.js";
import {HEADER} from "../../global/constants";

const Classification = () => {
  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const binaryPred = useSelector((state) => state.classification.binaryPred);
  const multiPred = useSelector((state) => state.classification.multiPred);

  const l=[];
  if (multiPred) {
      for (let i = 0; i < multiPred.length; i++) {
          l.push(<ResultItem key={i} name={HEADER[i]} percent={multiPred[i]}/>);
      }
      console.log("This is l: ", l);
  }

  return (
    <>
      <RightPopup title="Classification Results">
        <ul class="classification-list">
          <ResultItem name="Abnormality" percent={binaryPred} />
          {l.length > 0 ? l : null}
          {/* <li>
            <div class="classification-item-name-percent">
              <span class="classification-item-name">Class 2</span>
              <span class="percentage">30%</span>
            </div>
            <div class="classification-item-bar"></div>
          </li>
          <li>
            <div class="classification-item-name-percent">
              <span class="classification-item-name">Class 3</span>
              <span class="percentage">70%</span>
            </div>

            <div class="classification-item-bar">
              <div class="classification-item-bar-fill"></div>
            </div>
          </li>
          <li>
            <div class="classification-item-name-percent">
              <span class="classification-item-name">Class 3</span>
              <span class="percentage">70%</span>
            </div>
            <div class="classification-item-bar">
              <div class="classification-item-bar-fill"></div>
            </div>
          </li>
          <li>
            <div class="classification-item-name-percent">
              <span class="classification-item-name">Class 3</span>
              <span class="percentage">70%</span>
            </div>
            <div class="classification-item-bar">
              <div class="classification-item-bar-fill"></div>
            </div>
          </li> */}
        </ul>
      </RightPopup>
      {isLoadedImage && (
        <div className={`image-container ${isLoadedImage ? "loaded" : ""}`}>
          <img src={`data:image/png;base64,${loadedImg}`} />
        </div>
      )}
    </>
  );
};

export default Classification;
