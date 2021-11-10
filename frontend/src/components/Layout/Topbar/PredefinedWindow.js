import React from "react";
import Group from "./Group";
import axios from "axios";
import { useDispatch } from "react-redux";

import { imgActions, segmentedActions } from "../../../store";

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
      .post("http://localhost:8000/api/windowing/", {
        windowCenter: window.wc,
        windowWidth: window.ww,
      })
      .then((res) => {
        dispatch(imgActions.setImg(res.data.image));
        dispatch(segmentedActions.setImg(res.data.image));
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(segmentedActions.setIsLoadedImg(true));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Group additionalClass="predefined-window" title="Predefined window levels">
      {Object.keys(predefinedWindows).map((key) => (
        <button
          class="_btn"
          onClick={windowHandler.bind(this, predefinedWindows[key])}
        >
          {key}
        </button>
      ))}
    </Group>
  );
};

export default PredefinedWindow;
