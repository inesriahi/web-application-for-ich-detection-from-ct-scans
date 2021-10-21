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
import matplotlib.pyplot as plt


# Create your views here.
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
 
    def create(self, request):
        img = request.data['dcmimg']
        windowCenter = request.data['windowCenter']
        windowWidth = request.data['windowWidth']

        # Document.objects.create(title = title, file=img)
        img.seek(0)
        ds = pydicom.dcmread(img)
        windowd_image = get_hounsfield_window(ds, 0, 120)
        stretched_image = map_to_whole_image_range(windowd_image)

        ################# IMAGE PREPARATION FOR SENDING ##################
        # _, encoded_img = cv2.imencode('.png', np.asarray(stretched_image))
        coded_image = encode_img_to_string(stretched_image)
        metadata = []
        for d in ds:
            if d.description() == 'Pixel Data':
                continue
            metadata.append({'tag': str(d.tag), 'name': str(d.description()), 'value': str(d.value), 'vr': str(d.VR)})

        response = {'metadata': json.dumps(metadata),
                    'image': coded_image
                    }
        
        return HttpResponse(json.dumps(response), status=200)
        

@api_view(['POST'])
def segment_img_view(request):
    if request.method.upper() == 'POST':
        coors = request.data['coors']
        encoded_img = request.data['img']['img']
        img_size = request.data['img']['size']
        window = 0
        #################### CODE FOR SEGMENTATION IS HERE ########################
        # print(request.data)

        image = decode_string_to_image(encoded_img)
        segmented_image = region_growing_segmentation(image,coors,window)
        print(segmented_image)
        # Encode the segmented image

        # Send the segmented image
        return Response({"ReqData": request.data})


