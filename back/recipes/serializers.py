from rest_framework import serializers
from .models import Recipe, Ingredient, Recipe_Ingredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = Recipe_Ingredient
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    recipe_ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    
    class Meta:
        model = Recipe
        fields = '__all__'