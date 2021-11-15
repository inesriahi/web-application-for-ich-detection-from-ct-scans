import React from "react";
import Group from "./Group";
import axios from "axios";
import { useDispatch } from "react-redux";

import { imgActions, segmentedActions } from "../../../store";
import { WINDOWING_URL } from "../../../global/endpoints";

const PredefinedWindow = () => {
  const dispatch = useDispatch();

  const predefinedWindows = {
    Soft: { wc: "40", ww: "80" },
    Subdural: { wc: 60, ww: 200 },
    Stroke: { wc: 40, ww: 40 },
    Bone: { wc: 700, ww: 4000 },
    "Soft Tissues": { wc: 40, ww: 350 },
  };

  const windowHandler = (window) => {
    axios
      .post(WINDOWING_URL, {
        windowCenter: window.wc,
        windowWidth: window.ww,
      })
      .then((res) => {
        dispatch(imgActions.setImg(res.data.image));
        dispatch(segmentedActions.setSegmentedImg(res.data.image));
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(segmentedActions.setIsLoading(false));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Group additionalClass="predefined-window" title="Predefined window levels">
      {Object.keys(predefinedWindows).map((key) => (
        <button
        className="_btn"
          onClick={windowHandler.bind(this, predefinedWindows[key])}
        >
          {key}
        </button>
      ))}
    </Group>
  );
};

export default PredefinedWindow;
