from rest_framework import mixins, viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .serializers import UserSerializer, UserCreateSerializer

# Vista para ver, editar, eliminar usuarios (requiere autenticación)
class UserViewSet(mixins.ListModelMixin,       # GET /users/
                  mixins.RetrieveModelMixin,   # GET /users/{id}/
                  mixins.UpdateModelMixin,     # PUT/PATCH /users/{id}/
                  mixins.DestroyModelMixin,    # DELETE /users/{id}/
                  viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'delete']

    def get_serializer_class(self):
        return UserSerializer

# Vista para registrar un nuevo usuario (público)
class RegisterUserView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
