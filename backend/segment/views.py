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
from .helpers import get_hounsfield_window
import matplotlib.pyplot as plt


# Create your views here.
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def create(self, request):
        img = request.data['dcmimg']
        title = request.data['title']
        # Document.objects.create(title = title, file=img)
        img.seek(0)
        ds = pydicom.dcmread(img)
        windowd_image = get_hounsfield_window(ds, 0, 120)
        _, encoded_img = cv2.imencode('.png', np.asarray(windowd_image))
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
        
