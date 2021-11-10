import React, {useState} from "react";
import MetadataModel from "./MetadataModal/MetadataModal";
import { imgActions, segmentedActions } from "../../../store";
import { useSelector } from "react-redux";

const MetaData = () => {
  const metadata = useSelector((state) => state.img.metadata);
  const [showMetaModal, setShowMetaModal] = useState(false);

  return (
    <div>
      <button class="_btn meta" onClick={() => setShowMetaModal(true)}>
        <i class="fas fa-table"></i>Metadata
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
