import React from "react";
import Sidebar from "../Sidebar";
import Header from "./Header";

const Layout = (props) => {
  return (
    <>
      <Header />
      <div >
        <div className="row">
          <Sidebar />
          <main className="main col-md-9 ml-sm-auto col-lg-10 px-4">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
