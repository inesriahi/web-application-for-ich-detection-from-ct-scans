import React, { useState, useEffect } from "react";

const RightSidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (props.isDefaultOpen) {
      setIsOpen(true);
    }
  }, [props.isDefaultOpen]);

  return (
    <div className={`right-sidebar ${isOpen ? "open" : ""}`}>
      <div className="opener-right-sideabar" onClick={() => setIsOpen(true)}>
        <i className={props.openIconClass}></i>
        <div className="tool-tip">{props.openTooltip}</div>
      </div>
      <div className="right-sidebar-content" style={{ width: props.width }}>
        <div className="header">
          <div className="title">
            <h1>{props.title}</h1>
          </div>
          <i
            className="fas fa-times close"
            onClick={() => setIsOpen(false)}
          ></i>
        </div>
        {props.children}
      </div>
    </div>
  );
};

RightSidebar.defaultProps = { isDefaultOpen: false, width: "600px" };

export default RightSidebar;
