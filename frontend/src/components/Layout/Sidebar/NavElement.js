import React from 'react'
import { NavLink } from "react-router-dom";
import "../../../index.css";

const NavElement = (props) => {
    return (
        <li>
          <NavLink to={props.to} exact>
            <i className={props.iconClass}></i>
            <span>{props.name}</span>
          </NavLink>
          <span className="tool-tip">{props.name}</span>
        </li>
    )
}

export default NavElement
