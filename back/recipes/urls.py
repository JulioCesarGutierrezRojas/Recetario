from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, IngredientViewSet, RecipeIngredientViewSet

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'ingredients', IngredientViewSet)
router.register(r'recipe_ingredients', RecipeIngredientViewSet)

urlpatterns = router.urls