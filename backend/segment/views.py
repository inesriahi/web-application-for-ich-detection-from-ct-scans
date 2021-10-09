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

    # def post(self, request, *args, **kwargs):
    #     print("Printed ", request)
    #     img = request.data['dcmimg']
    #     title = request.data['title']
    #     Document.objects.create(title = title, file=img)
    #     return HttpResponse({'message': 'Book Created'}, status=200)
    def create(self, request):
        img = request.data['dcmimg']
        title = request.data['title']
        Document.objects.create(title = title, file=img)
        img.seek(0)
        ds = pydicom.dcmread(img)
        windowd_image = get_hounsfield_window(ds, 0, 120)
        # cv2.imshow("one",windowd_image)


        _, encoded_img = cv2.imencode('.png', np.asarray(windowd_image))
        coded_image = base64.b64encode(encoded_img).decode('utf-8')
        # print(type(coded_image))
        # print(coded_image)
        # dir(ds.to_json)
        response = {'metadata': ds.to_json(),
                    'image': coded_image
                    }
        # print(ds.to_json_dict()["00080005"])
        # i = base64.b64encode(ds.pixel_array)#.decode('utf-8')
        # i.seek(0)
        # i = io.BytesIO(i)
        
        # i = mpimg.imread(i, format='JPG')

        # plt.imshow(i, interpolation='nearest')
        # plt.show()
        return HttpResponse(json.dumps(response), status=200)
        
