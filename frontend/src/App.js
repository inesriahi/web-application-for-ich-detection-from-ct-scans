import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Segmentation from "./pages/Segmentation";
import Exploration from "./pages/Exploration";
import Classification from "./pages/Classification";
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
            <Exploration />
          </Route>
          <Route path="/segmentation" exact>
            <Segmentation />
          </Route>
          <Route path="/classification" exact>
            <Classification />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
