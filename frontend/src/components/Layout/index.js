import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar/Topbar";

const Layout = (props) => {
  return (
    <>
      <Topbar />
      <div >
        <div className="row">
          <Sidebar />
          <main className="main mx-auto px-4">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
