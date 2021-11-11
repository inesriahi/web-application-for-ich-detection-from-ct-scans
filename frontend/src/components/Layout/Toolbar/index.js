import React from "react";
import Tool from "./Tool";

const Toolbar = (props) => {
  console.log("These ", props.tools);
  return (
    <div class="toolbar">
      <ul class="toolbar-list">
        {props.tools.map((tool) => (
          <Tool
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
