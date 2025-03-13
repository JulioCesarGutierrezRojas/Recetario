from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from recipes.models import Recipe
from users.models import User

# Modelo de calificaciones
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    calification = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    created_at = models.DateTimeField(auto_now_add=True)
