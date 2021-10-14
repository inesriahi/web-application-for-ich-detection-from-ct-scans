import React from "react";
import "../../index.css";
import UploadForm from "./UploadForm";

const Sidebar = () => {
  return (
    <div className="col-md-3 d-md-block bg-dark sidebar mx-3">
      <div className="sidebar-sticky">
          <UploadForm />
      </div>
    </div>
  );
};

export default Sidebar;
