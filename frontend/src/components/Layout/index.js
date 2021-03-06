import React from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = (props) => {
  return (
    <>
      <Sidebar />
      <section className="main">
        <Topbar />
        <main className="main-content">
          <div className="content">{props.children}</div>
        </main>
      </section>
    </>
  );
};

export default Layout;
