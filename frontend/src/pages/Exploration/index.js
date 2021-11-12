import React, {useState} from "react";
import { useSelector } from "react-redux";
import DragAndDrop from "../../components/Extensions/DragAndDrop";

const Exploration = () => {
  const loadedImg = useSelector((state) => state.img.img);
  const isLoadedImage = useSelector((state) => state.img.isLoadedImg);
  const [files, setFiles] = useState(['nice.pdf', 'verycool.jpg']);


  const handleDrop = (myfiles) => {
    let fileList = files
    for (let i = 0; i < myfiles.length; i++) {
      if (!myfiles[i].name) return
      fileList.push(myfiles[i].name)
    }
    setFiles(fileList)
  }

  return (
    <>
      {!isLoadedImage && (
        <div class="image-container">
          <DragAndDrop handleDrop={handleDrop}>
            <div style={{ height: 300, width: 250 }}>
              {files.map((file) => (
                <div>{file}</div>
              ))}
            </div>
          </DragAndDrop>
        </div>
      )}
      {isLoadedImage && (
        <div className={`image-container ${isLoadedImage ? "loaded" : ""}`}>
          <img src={`data:image/png;base64,${loadedImg}`} />
        </div>
      )}
    </>
  );
};

export default Exploration;
