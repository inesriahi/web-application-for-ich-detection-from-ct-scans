import React, {useState} from "react";
import "../../../index.css";
import NavMenu from "./NavMenu";


const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`_sidebar ${isSidebarOpen? "open": ""}`}>
      <div className="logo_content">
        <div className="logo">
          <i className="fas fa-brain"></i>
          <div className="logo_name">ScanLens</div>
        </div>
        <i className="fas fa-bars menu" onClick={() => setIsSidebarOpen(value => !value)}></i>
      </div>
      <NavMenu />
    </div>
  );
};

export default Sidebar;
