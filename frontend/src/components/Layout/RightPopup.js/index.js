import React from "react";

const RightPopup = (props) => {
  return (
    <div className="right-popup">
      <div className="header">
        <div className="title">
          <h1>{props.title}</h1>
        </div>
      </div>
      <div className="body">
          {props.children}
      </div>
    </div>
  );
};

export default RightPopup;
