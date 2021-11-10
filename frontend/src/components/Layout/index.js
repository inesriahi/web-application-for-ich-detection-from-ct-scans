import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Toolbar from "./Toolbar";
import RightSidebar from "./RightSidebar";

const Layout = (props) => {
  return (
    <>
      <Sidebar />
      <section className="main">
        <Topbar />
        <RightSidebar />
        <Toolbar />
        <main className="main-content">
          <div class="content">{props.children}</div>
        </main>
      </section>
    </>
  );
};

export default Layout;
