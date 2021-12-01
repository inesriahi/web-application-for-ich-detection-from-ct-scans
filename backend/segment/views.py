# import needed libraries
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
from .gradcam_helpers import *
from .classification_helpers import *
from .segmentation_helpers import *
import matplotlib.pyplot as plt
import cv2

# initialize global variables
img_dcom = None
windowCenter = 40
windowWidth = 80
BinaryModel = keras.models.load_model('segment/models/best_model_densenet201.h5')
Multilabel = keras.models.load_model('segment/models/multilabel.h5', custom_objects={"single_class_crossentropy": np_multilabel_loss})


# Create your views here.
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
 
    def create(self, request):
        global img_dcom
        img = request.data['dcmimg']

        img.seek(0)
        img_dcom = pydicom.dcmread(img)

        min_value,max_value = get_min_max_of_window_value(windowCenter,windowWidth)
        windowd_image = get_hounsfield_window(img_dcom, min_value, max_value)
        stretched_image = map_to_whole_image_range(windowd_image)

        ################# IMAGE PREPARATION FOR SENDING ##################
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

        #################### CODE FOR SEGMENTATION IS HERE ########################

        print(windowCenter,windowWidth)
        if windowCenter and windowWidth:
            min_value,max_value= get_min_max_of_window_value(windowCenter,windowWidth)
            windowd_image = get_hounsfield_window(img_dcom, min_value, max_value)
        elif windowCenter or windowWidth:
            # error message can't set only one value
            pass
        else:
            windowd_image = img_dcom.pixel_array


        segmented_image = region_growing_segmentation(windowd_image,coors)
        # Features Extraction
        features = featureExtractor(windowd_image, segmented_image)
        # print(features)

        segmented_image = map_to_whole_image_range(segmented_image)
        windowd_image = map_to_whole_image_range(windowd_image)

        merged = merge_image(windowd_image, segmented_image)
        merged = encode_img_to_string(merged)

        
        # get hist
        histogram = segmented_area_histogram(windowd_image,segmented_image)
        # Send the segmented image
        return Response({"segmentation": merged, "statistics":json.dumps(features),"histogram":json.dumps(histogram)}) #encoded_segmentation

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
def classificationWithGradcam_view(request):

    #load saved Binary model
    print("Binary Classification Started...")
    
    #predict
    binaryPred, binaryHeatmap = plot_GradCAM(BinaryModel, img_dcom,['Normal', 'Abnormal'], base_line_model_index = 2 ,stack=True) #, layerName = 'conv5_block3_out'
    
    print("Binary Model Finished...")
    
    #load saved Multilabel model
  
    multiPred = None
    if binaryPred > 0.5:
        print("Multilabel Classification Started...")
        img = preprocess_img_bone(img_dcom)
        img = tf.image.resize(img, (224,224))
        img = tf.expand_dims(img, axis=0)
        
        # gradcamMulti  = plot_GradCAM(Multilabel, img_dcom, ['epidural', 'intraparenchymal', 'intraventricular', 'subarachnoid', 'subdural'],class_idx=4, base_line_model_index = 2 ,stack=True, colormap=cv2.COLORMAP_HOT) #layerName = 'conv5_block16_concat',
        multiPred = Multilabel.predict(img)
        print("Multilabel Model Finished...")
        

    stretched_heatmap = map_to_whole_image_range(binaryHeatmap)
    coded_heatmap = encode_img_to_string(stretched_heatmap)

    print("binaryPred:", binaryPred)
    print("multiPred:",multiPred)
    return Response({"binaryPred": binaryPred, "multiPred": multiPred, "binaryHeatmap": coded_heatmap}) 