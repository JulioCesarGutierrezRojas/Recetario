from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import mixins, viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import User, Role
from .serializers import UserSerializer, RegisterUserDTO

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

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        user = RegisterUserDTO(data=request.data)

        if not user.is_valid():
            return Response({'error': user.errors}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(**user.validated_data, role=Role.USER)

        return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
