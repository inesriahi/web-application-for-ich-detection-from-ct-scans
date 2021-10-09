import { useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState("");
  const [metadata, setMetadata] = useState();

  const newDocument = () => {
    const uploadData = new FormData();
    uploadData.append("title", title);
    uploadData.append("dcmimg", img);
    axios
      .post("http://localhost:8000/api/documents/", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setImg(res.data.image)
        console.log(JSON.parse(res.data.metadata))
        // setMetadata(JSON.parse(res.data.metadata))
      })
      .catch((err) => console.error(err));
  };
  return (
    <div>
      <h3>Upload images with React</h3>
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label>
        Image
        <input
          type="file"
          accept="*/dicom,.dcm, image/dcm, */dcm, .dicom"
          onChange={(event) => setImg(event.target.files[0])}
        />
      </label>
      <br />
      <button onClick={() => newDocument()}>New Book</button>

      {img !== "" && <img width='500' src={`data:image/png;base64,${img}`} />}
      {metadata && <p>{metadata}</p>}
    </div>
  );
}

export default App;
