from rest_framework import viewsets, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import Recipe
from .serializers import RecipeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all() 
    serializer_class = RecipeSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_queryset(self):
        user_param = self.request.query_params.get('user')

        if user_param == 'me':
            return self.queryset.filter(user=self.request.user)

        if user_param:
            return self.queryset.filter(user_id=user_param)

        return self.queryset  # todas las recetas

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'message': 'Receta creada exitosamente'}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'message': 'Receta actualizada exitosamente'}, status=status.HTTP_200_OK)