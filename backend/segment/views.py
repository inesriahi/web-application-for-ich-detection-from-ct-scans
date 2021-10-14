from django.shortcuts import render
from .models import Document
from .serializers import DocumentSerializer
from rest_framework import viewsets
from django.http import HttpResponse
import pydicom
import base64
import json
import cv2
import numpy as np
from .helpers import get_hounsfield_window, map_to_whole_image_range
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
        _, encoded_img = cv2.imencode('.png', np.asarray(stretched_image))
        coded_image = base64.b64encode(encoded_img).decode('utf-8')
        metadata = []
        for d in ds:
            if d.description() == 'Pixel Data':
                continue
            metadata.append({'tag': str(d.tag), 'name': str(d.description()), 'value': str(d.value), 'vr': str(d.VR)})

        response = {'metadata': json.dumps(metadata),
                    'image': coded_image
                    }
        
        return HttpResponse(json.dumps(response), status=200)
        
