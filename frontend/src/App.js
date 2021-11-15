import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Segmentation from "./pages/Segmentation";
import Exploration from "./pages/Exploration";
import Classification from "./pages/Classification";
import Layout from "./components/Layout";
import { SEGMENTATION, CLASSIFICATION, EXPLORATION } from "./global/pageNames";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import DragAndDrop from "./components/Extensions/DragAndDrop";

// import UploadForm from "./components/Sidebar/UploadForm";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path={EXPLORATION} exact>
            <Exploration />
          </Route>
          <Route path={SEGMENTATION} exact>
            <Segmentation />
          </Route>
          <Route path={CLASSIFICATION} exact>
            <Classification />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
