from django.shortcuts import render
from rest_framework import viewsets
from .models import Rating
from .serializers import RatingSerializer

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all().order_by('created_at')
    serializer_class = RatingSerializer

# Create your views here.
