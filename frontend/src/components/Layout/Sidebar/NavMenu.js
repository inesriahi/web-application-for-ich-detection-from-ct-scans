import React from "react";
import NavElement from "./NavElement";
import UploadForm from "./UploadForm";
import {CLASSIFICATION, SEGMENTATION, EXPLORATION} from "../../../global/pageNames"
import "../../../index.css";

const NavMenu = () => {
  return (
    <ul class="nav-list">
        <UploadForm />
        <NavElement iconClass="fas fa-camera" name = "Exploration" to={EXPLORATION}/>
        <NavElement iconClass="fas fa-scissors" name = "Segmentation" to={SEGMENTATION}/>
        <NavElement iconClass="fas fa-project-diagram" name = "Classification" to={CLASSIFICATION}/>
      </ul>
  );
};

export default NavMenu;
