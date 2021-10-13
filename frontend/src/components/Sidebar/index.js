import React from "react";
import "../../index.css";
import UploadForm from "./UploadForm";

const Sidebar = () => {
    return (
        <div id="sidebar" className="d-flex bg-light">
            <UploadForm />
        </div>
    )
};

export default Sidebar;
