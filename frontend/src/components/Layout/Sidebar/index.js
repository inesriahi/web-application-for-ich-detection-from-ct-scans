import React from "react";
import "../../../index.css";
import NavMenu from "./NavMenu";
import UploadForm from "./UploadForm";

const Sidebar = () => {
  return (
    <div className="col-3 d-md-block bg-dark sidebar mx-3">
      <div className="sidebar-sticky">
          <UploadForm />
          <NavMenu />
      </div>
    </div>
  );
};

export default Sidebar;
