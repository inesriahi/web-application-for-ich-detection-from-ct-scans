import React from "react";

const ResultItem = (props) => {
  return (
    <li className="classification-item">
      <div className="classification-item-name-percent">
        <span className="classification-item-name">{props.name}</span>
        <span className="percentage">{(+props.percent * 100).toFixed(2)}%</span>
      </div>
      <div className="classification-item-bar">
        <div className="classification-item-bar-fill" style={{width: (+props.percent * 100).toFixed(2) + "%"}}></div>
      </div>
    </li>
  );
};

export default ResultItem;
