from django.shortcuts import render
from rest_framework import viewsets
from .models import Recipe, Ingredient, Recipe_Ingredient
from .serializers import RecipeSerializer, IngredientSerializer, RecipeIngredientSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all() 
    serializer_class = RecipeSerializer

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

class RecipeIngredientViewSet(viewsets.ModelViewSet):
    queryset = Recipe_Ingredient.objects.all()
    serializer_class = RecipeIngredientSerializer
    

# Create your views here.
