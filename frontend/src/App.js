import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import SegmentCanvas from "./pages/SegmentationTab";
import Canvas from "./pages/Canvas";
import Layout from "./components/Layout";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

// import UploadForm from "./components/Sidebar/UploadForm";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
        <Route path="/" exact>
            <Canvas />
          </Route>
          <Route path="/segment" exact>
            <SegmentCanvas />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
