from django.shortcuts import render
from rest_framework import viewsets
from .models import Rating
from .serializers import RatingSerializer

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all().order_by('created_at')
    serializer_class = RatingSerializer

    def get_queryset(self):
        user_param = self.request.query_params.get('user')

        if user_param == 'me':
            return self.queryset.filter(user=self.request.user)

        if user_param:
            return self.queryset.filter(user_id=user_param)

        return self.queryset.all()

# Create your views here.
