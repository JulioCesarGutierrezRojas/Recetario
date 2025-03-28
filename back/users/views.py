from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer, UserCreateSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        
        if self.action in ["create"]:
            return [AllowAny()]
        return [IsAuthenticated()]



