import React from "react";

const RightPopup = (props) => {
  return (
    <div class="right-popup">
      <div class="header">
        <div class="title">
          <h1>{props.title}</h1>
        </div>
      </div>
      <div class="body">
          {props.children}
      </div>
    </div>
  );
};

export default RightPopup;
