from django.db import models

# Create your models here.
class Document(models.Model):
    file = models.ImageField(upload_to='documents', max_length=100)
