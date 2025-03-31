from django.db import models

from users.models import User

# Modelo de Recetas, Ingredientes y Recetas-Ingredientes
class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes',null=True, blank=True)
    name = models.CharField(max_length=100)
    process = models.TextField()
    serving_council = models.TextField()
    image = models.ImageField(upload_to='recipes/images/')

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Recipe_Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='recipe_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT, related_name='recipe_ingredients')
    quantity = models.DecimalField(decimal_places=2, max_digits=6)

    class Meta:
        unique_together = ('recipe', 'ingredient')

    def __str__(self):
        return self.recipe.name
