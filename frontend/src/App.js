import "bootstrap/dist/css/bootstrap.min.css";
import BodyCanvas from "./components/BodyCanvas";
import Layout from "./components/Layout";
// import UploadForm from "./components/Sidebar/UploadForm";

function App() {
  return (
    <Layout>
      <BodyCanvas />
    </Layout>
  );
}

export default App;
