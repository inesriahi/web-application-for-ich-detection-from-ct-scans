import React from "react";

const ResultItem = (props) => {
  return (
    <li class="classification-item">
      <div class="classification-item-name-percent">
        <span class="classification-item-name">{props.name}</span>
        <span class="percentage">{(+props.percent * 100).toFixed(2)}%</span>
      </div>
      <div class="classification-item-bar">
        <div class="classification-item-bar-fill" style={{width: (+props.percent * 100).toFixed(2) + "%"}}></div>
      </div>
    </li>
  );
};

export default ResultItem;
