from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import User, Role
from .serializers import RegisterUserDTO

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        user = RegisterUserDTO(data=request.data)

        if not user.is_valid():
            return Response({'error': user.errors}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(**user.validated_data, role=Role.USER)

        """
        User.objects.create_user(
            email = user.validated_data['email'],
            password = user.validated_data['password'],
            name = user.validated_data['name'],
            sex = user.validated_data['sex'],
            role = Role.USER
        )
        """

        return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
