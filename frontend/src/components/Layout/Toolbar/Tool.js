import React from "react";

const Tool = (props) => {
  return (
    <>
      {!props.disabled && (
        <li onClick={props.onClick} className={props.isActive ? "active" : ""}>
          <a>
            <i className={props.iconClass}></i>
          </a>
          <span className="tool-tip">{props.name}</span>
        </li>
      )}
    </>
  );
};

Tool.defaultProps = { isActive: false };

export default Tool;
