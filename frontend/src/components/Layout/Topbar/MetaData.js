import React, {useState} from "react";
import MetadataModel from "./MetadataModal/MetadataModal";
import { useSelector } from "react-redux";

const MetaData = () => {
  const metadata = useSelector((state) => state.img.metadata);
  const [showMetaModal, setShowMetaModal] = useState(false);

  return (
    <div>
      <button className="_btn meta" onClick={() => setShowMetaModal(true)}>
        <i className="fas fa-table"></i>Metadata
      </button>
      <MetadataModel
        setShowMetaModal={setShowMetaModal}
        metadata={metadata}
        showMetaModal={showMetaModal}
      />
    </div>
  );
};

export default MetaData;
