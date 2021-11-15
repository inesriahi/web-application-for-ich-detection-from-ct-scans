import React from "react";
import Tool from "./Tool";

const Toolbar = (props) => {
  return (
    <div className="toolbar">
      <ul className="toolbar-list">
        {props.tools.map((tool) => (
          <Tool
            key={Math.random()}
            disabled={tool.disabled}
            isActive={tool.isActive}
            name={tool.name}
            iconClass={tool.iconClass}
            onClick={tool.onClickHandler}
          />
        ))}
      </ul>
    </div>
  );
};

Toolbar.defaultProps = { tools: [] };

export default Toolbar;
