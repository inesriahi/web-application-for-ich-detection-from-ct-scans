from django.shortcuts import render
from .models import Document
from .serializers import DocumentSerializer
from rest_framework import viewsets
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import pydicom
import json
from .helpers import *
from .classification_helpers import *
import matplotlib.pyplot as plt

img_dcom = None
windowCenter = None
windowWidth = None

# Create your views here.
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
 
    def create(self, request):
        global img_dcom
        img = request.data['dcmimg']

        # Document.objects.create(title = title, file=img)
        img.seek(0)
        img_dcom = pydicom.dcmread(img)
        # print("window center value="+str(windowCenter)+"window width value="+str(windowWidth))
        # print("window min value="+str(min_value)+"window max value="+str(max_value))
        print(np.max(img_dcom.pixel_array), np.min(img_dcom.pixel_array))
        stretched_image = map_to_whole_image_range(img_dcom.pixel_array)
        print(np.max(stretched_image), np.min(stretched_image))

        ################# IMAGE PREPARATION FOR SENDING ##################
        # _, encoded_img = cv2.imencode('.png', np.asarray(stretched_image))
        coded_image = encode_img_to_string(stretched_image)
        metadata = []
        # print(type(img_dcom))
        for d in img_dcom:
            if d.description() == 'Pixel Data':
                continue
            metadata.append({'tag': str(d.tag), 'name': str(d.description()), 'value': str(d.value), 'vr': str(d.VR)})
        # print(img_dcom)
        response = {'metadata': json.dumps(metadata),
                    'image': coded_image
                    }
        
        return HttpResponse(json.dumps(response), status=200)
        

@api_view(['POST'])
def segment_img_view(request):
    if request.method.upper() == 'POST':
        coors = request.data['coors']
        # encoded_img = request.data['img']['img']
        # img_size = request.data['img']['size']
        #################### CODE FOR SEGMENTATION IS HERE ########################
        # print(request.data)
        print(windowCenter,windowWidth)
        if windowCenter and windowWidth:
            min_value,max_value= get_min_max_of_window_value(windowCenter,windowWidth)
            windowd_image = get_hounsfield_window(img_dcom, min_value, max_value)
        elif windowCenter or windowWidth:
            # error message can't set only one value
            pass
        else:
            windowd_image = img_dcom.pixel_array

        # image = decode_string_to_image(encoded_img)
        # image = img_dcom.pixel_array

        segmented_image = region_growing_segmentation(windowd_image,coors)
        # Features Extraction
        features = featureExtractor(windowd_image, segmented_image)
        # print(features)

        segmented_image = map_to_whole_image_range(segmented_image)
        windowd_image = map_to_whole_image_range(windowd_image)

        merged = merge_image(windowd_image, segmented_image)
        merged = encode_img_to_string(merged)

        # Encode the segmented image
        # encoded_segmentation =encode_img_to_string(segmented_image)
        
        # Send the segmented image
        return Response({"segmentation": merged, "statistics":json.dumps(features)}) #encoded_segmentation


@api_view(['POST'])
def windowing_view(request):
    global windowCenter, windowWidth
    windowCenter = int(request.data['windowCenter'])
    windowWidth = int(request.data['windowWidth'])
    min_value,max_value= get_min_max_of_window_value(windowCenter,windowWidth)
    windowd_image = get_hounsfield_window(img_dcom, min_value, max_value)
    stretched_image = map_to_whole_image_range(windowd_image)
    coded_image = encode_img_to_string(stretched_image)
    response = {'image': coded_image}
        
    return HttpResponse(json.dumps(response), status=200)



@api_view(['POST'])
def classification_view(request):
    multilabel_header = ['epidural', 'intraparenchymal', 'intraventricular', 'subarachnoid', 'subdural']

    # read image
    dcm = img_dcom
    # correct dcm
    if (dcm.BitsStored == 12) and (dcm.PixelRepresentation == 0) and (int(dcm.RescaleIntercept) > -100):
        correct_dcm(dcm)
    img = bsb_window(dcm)
    img = tf.convert_to_tensor(img, dtype=tf.float64)
    img = tf.image.resize(img, (224,224))
    img = np.reshape(img,(1, 224, 224, 3))

    #load saved Binary model
    Binary_model = keras.models.load_model('segment/models/binary.h5')
    #predict
    binaryPred = Binary_model.predict(img)
    #load saved Multilabel model
    Multilabel = keras.models.load_model('segment/models/multilabel.h5', custom_objects={"single_class_crossentropy": np_multilabel_loss})
  
    if binaryPred > 0.5:
        multiPred = Multilabel.predict(img)
        
    else:
        multiPred = None
    
    print("binaryPred:",binaryPred)
    print("multiPred:",multiPred)
    print("multilabel_header:",multilabel_header)
    return Response({"binaryPred": binaryPred, "multiPred": multiPred, "multilabel_header:": multilabel_header})  