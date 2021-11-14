import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { imgActions, segmentedActions } from "../../../store";
import { WINDOWING_URL } from "../../../global/endpoints";

import Group from "./Group";
import axios from "axios";

const CustomizedWindow = () => {
  const dispatch = useDispatch();

  const [windowCenter, setWindowCenter] = useState("");
  const [windowWidth, setWindowWidth] = useState("");

  const windowHandler = (e) => {
    e.preventDefault();
    axios
      .post(WINDOWING_URL, {
        windowCenter: windowCenter,
        windowWidth: windowWidth,
      })
      .then((res) => {
        dispatch(imgActions.setImg(res.data.image));
        dispatch(segmentedActions.setImg(res.data.image));
        dispatch(imgActions.setIsLoadedImg(true));
        dispatch(segmentedActions.setIsLoadedImg(true));
        setWindowCenter("");
        setWindowWidth("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <Group additionalClass="custom-window" title="Customizing window level">
      <form class="content" onSubmit={windowHandler}>
        <input
          type="number"
          name="wc"
          placeholder="Window Center"
          class="input-window"
          value={windowCenter}
          onChange={(e) => setWindowCenter(e.target.value)}
        />
        <input
          type="number"
          name="ww"
          placeholder="Window Width"
          class="input-window"
          value={windowWidth}
          onChange={(e) => setWindowWidth(e.target.value)}
        />
        <input type="submit" value="Update" class="_btn" />
      </form>
    </Group>
  );
};

export default CustomizedWindow;
