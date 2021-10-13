import React from "react";
import "../../index.css";
import UploadForm from "./UploadForm";

const Sidebar = () => {
  return (
    <div className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
          <UploadForm />
      </div>
    </div>
  );
};

export default Sidebar;
