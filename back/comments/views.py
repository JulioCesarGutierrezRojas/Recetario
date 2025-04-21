from django.shortcuts import render
from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer

    def get_queryset(self):
        user_param = self.request.query_params.get('user')
        recipe_param = self.request.query_params.get('recipe')

        queryset = self.queryset

        if user_param == 'me':
            queryset = queryset.filter(user=self.request.user)
        elif user_param:
            queryset = queryset.filter(user_id=user_param)

        if recipe_param:
            queryset = queryset.filter(recipe_id=recipe_param)

        return queryset

# Create your views here.
