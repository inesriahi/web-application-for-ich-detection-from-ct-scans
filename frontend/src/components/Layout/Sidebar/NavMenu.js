import React from "react";
import NavElement from "./NavElement";
import UploadForm from "./UploadForm";
import {CLASSIFICATION, SEGMENTATION, EXPLORATION} from "../../../global/pageNames"
import "../../../index.css";

const NavMenu = () => {
  return (
    <ul className="nav-list">
        <UploadForm />
        <NavElement iconClass="fas fa-camera" name = "Exploration" to={EXPLORATION}/>
        <NavElement iconClass="fas fa-project-diagram" name = "Classification" to={CLASSIFICATION}/>
        <NavElement iconClass="fas fa-scissors" name = "Segmentation" to={SEGMENTATION}/>
      </ul>
  );
};

export default NavMenu;
