from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginDTO
from .utils import send_recovery_email, generate_token
from users.models import User, Token, Role

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        user = LoginDTO(data=request.data)

        if not user.is_valid():
            return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

        found_user = User.objects.filter(email=user.validated_data['email']).first()

        if found_user and found_user.check_password(user.validated_data['password']):
            token = AccessToken.for_user(found_user)
            token['email'] = found_user.email
            token['name'] = found_user.name
            token['role'] = found_user.role

            return Response({'token': str(token), 'role': found_user.role, 'id': found_user.id}, status=status.HTTP_200_OK)

        return Response({'error': 'Credenciales Invalidas'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_email_recover(request):
    try:
        email = request.data.get('email')

        if not email:
            return Response({'error': 'El correo es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        user_found = User.objects.filter(email=email).first()

        if not user_found:
            return Response({'error': 'No existe un usuario con ese correo'}, status=status.HTTP_400_BAD_REQUEST)

        Token.objects.filter(user=user_found).delete()

        token, expiration = generate_token()
        Token.objects.create(user=user_found, token=token, date_expiration=expiration)

        send_recovery_email(email,token, user_found.name)

        return Response({'message': 'Se te ha enviado un correo para recuperar tu contraseña'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_token(request):
    try:
        token = request.data.get('token')

        if not token or not email:
            return Response({'error': 'El token y el correo son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        user_found = User.objects.filter(email=email).first()

        if not user_found:
            return Response({'error': 'No existe un usuario con ese correo'}, status=status.HTTP_400_BAD_REQUEST)

        token_found = Token.objects.filter(user=user_found, token=token).first()

        if not token_found:
            return Response({'error': 'Token invalido o expirado'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Token valido'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)