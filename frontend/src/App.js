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


function App() {
  return (
    // Router for the routes in the application
    <Router>
      <Layout>
        <Switch>
          <Route path={EXPLORATION} exact>
            <Exploration />
          </Route>
          <Route path={CLASSIFICATION} exact>
            <Classification />
          </Route>
          <Route path={SEGMENTATION} exact>
            <Segmentation />
          </Route>
          
          <Redirect to="/" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
