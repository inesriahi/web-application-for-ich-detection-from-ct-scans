import { useDispatch } from "react-redux";
import { UPLOAD_URL } from "../global/endpoints";
import axios from "axios";
import {
  imgActions,
  segmentedActions,
  classificationActions,
} from "../store";

const useImageUploader = () => {

    const dispatch = useDispatch();

    const imgUploader = (image) => {
        const uploadData = new FormData();
        uploadData.append("dcmimg", image);
        axios
          .post(UPLOAD_URL, uploadData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            // console.log(res.data.image);
            dispatch(imgActions.setImg(res.data.image));
            dispatch(imgActions.setIsLoadedImg(true));
            dispatch(imgActions.setMetadata(JSON.parse(res.data.metadata)));
    
            dispatch(segmentedActions.setSegmentedImg(res.data.image));
            dispatch(segmentedActions.setIsSegmented(false));
            dispatch(segmentedActions.setIsLoading(false));
            dispatch(segmentedActions.setMarksArray([]));
            dispatch(segmentedActions.setMarkersActualCoor([]));
            dispatch(segmentedActions.setHistogram([]));
            dispatch(segmentedActions.setStatistics([]));
    
            dispatch(classificationActions.setIsClassified(false));
          })
          .catch((err) => console.error(err));
      };

      return imgUploader
}

export default useImageUploader
