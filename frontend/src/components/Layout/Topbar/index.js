import React from "react";
import CustomizedWindow from "./CustomizedWindow";
import MetaData from "./MetaData";
import PredefinedWindow from "./PredefinedWindow";
import { useSelector } from "react-redux";

const Topbar = () => {
  const isLoadedImg = useSelector((state) => state.img.isLoadedImg);

  return (
    <div class="topbar">
      {isLoadedImg && (
        <>
          <div class="topbar_left">
            <CustomizedWindow />
            <PredefinedWindow />
          </div>

          <div class="topbar_right">
            <MetaData />
          </div>
        </>
      )}
    </div>
  );
};

export default Topbar;
