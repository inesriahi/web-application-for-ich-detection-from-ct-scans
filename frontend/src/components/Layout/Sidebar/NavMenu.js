import React from "react";
import NavElement from "./NavElement";
import UploadForm from "./UploadForm";

import "../../../index.css";

const NavMenu = () => {
  return (
    <ul class="nav-list">
        <UploadForm />
        <NavElement iconClass="fas fa-camera" name = "Exploration" to="/" />
        <NavElement iconClass="fas fa-scissors" name = "Segmentation" to="/segmentation" />
        <NavElement iconClass="fas fa-project-diagram" name = "Classification" to="/classification"/>
      </ul>
  );
};

export default NavMenu;
