from django.db import models

# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.ImageField(upload_to='documents', max_length=100)

    def __str__(self):
        return self.title