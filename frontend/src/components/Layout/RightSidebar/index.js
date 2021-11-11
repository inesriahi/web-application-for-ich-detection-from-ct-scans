import React, { useState } from "react";

const RightSidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`right-sidebar ${isOpen ? "open" : ""}`}>
      <div className="opener-right-sideabar" onClick={() => setIsOpen(true)}>
        <i className="far fa-chart-bar"></i>
        <div className="tool-tip">Texture Analysis</div>
      </div>
      <div className="right-sidebar-content">
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

export default RightSidebar;
