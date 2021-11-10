import React from "react";
import { NavLink } from "react-router-dom";

const NavMenu = () => {
  return (
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <NavLink className="nav-link" to="/" exact>
          Exploration
        </NavLink>
        <NavLink className="nav-link" to="/segment" exact>
          Segmentation & Texture Analysis
        </NavLink>
      </li>
    </ul>
  );
};

export default NavMenu;
