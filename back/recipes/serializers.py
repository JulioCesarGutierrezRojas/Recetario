from rest_framework import serializers
from .models import Recipe, Ingredient, Recipe_Ingredient
from django.db import transaction
import json

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'
        extra_kwargs = { 'name': { 'validators': [] } }

class RecipeIngredientSerializer(serializers.ModelSerializer):
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    #linea anterior: ingredient = IngredientSerializer()

    class Meta:
        model = Recipe_Ingredient
        fields = ['ingredient', 'quantity']

class RecipeSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    recipe_ingredients = serializers.SerializerMethodField()
    
    class Meta:
        model = Recipe
        fields = ['id', 'user', 'name', 'process', 'serving_council', 'image', 'recipe_ingredients']
        read_only_fields = ['user']

    def get_image(self, obj):
        request = self.context.get('request')

        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_recipe_ingredients(self, obj):
        queryset = obj.recipe_ingredients.all()
        return RecipeIngredientSerializer(queryset, many=True).data

    def create(self, validated_data):
        recipe_ingredients_data = self.initial_data.get('recipe_ingredients')

        if isinstance(recipe_ingredients_data, str):
            try:
                recipe_ingredients_data = json.loads(recipe_ingredients_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("El campo recipe_ingredients debe ser un JSON válido.")

        with transaction.atomic():
            recipe = Recipe.objects.create(**validated_data)
            for item in recipe_ingredients_data:
                ingredient_name = item['ingredient']
                ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_name)
                Recipe_Ingredient.objects.create(
                    recipe=recipe,
                    ingredient=ingredient,
                    quantity=item['quantity']
                )

        return recipe

    def update(self, instance, validated_data):
        validated_data.pop('user', None)
        recipe_ingredients_data = self.initial_data.get('recipe_ingredients')

        if recipe_ingredients_data and isinstance(recipe_ingredients_data, str):
            try:
                recipe_ingredients_data = json.loads(recipe_ingredients_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("El campo recipe_ingredients debe ser un JSON válido.")

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if recipe_ingredients_data is not None:
                instance.recipe_ingredients.all().delete()

                for recipe_ingredient in recipe_ingredients_data:
                    ingredient_name = recipe_ingredient['ingredient']
                    ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_name)
                    Recipe_Ingredient.objects.create(recipe=instance, ingredient=ingredient, quantity=recipe_ingredient['quantity'])

        return instance
