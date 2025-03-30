from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginDTO, ResetPasswordDTO, SendEmailRecoverDTO, VerifyTokenDTO
from .utils import send_recovery_email, generate_token
from users.models import User, Token

import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        user = LoginDTO(data=request.data)

        if not user.is_valid():
            return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

        found_user = User.objects.filter(email=user.validated_data['email']).first()

        if not found_user.is_active:
            return Response({'error': 'Usuario inactivo'}, status=status.HTTP_400_BAD_REQUEST)

        if found_user and found_user.check_password(user.validated_data['password']):
            token = AccessToken.for_user(found_user)
            token['email'] = found_user.email
            token['name'] = found_user.name
            token['role'] = found_user.role

            return Response({'token': str(token), 'role': found_user.role, 'id': found_user.id}, status=status.HTTP_200_OK)

        return Response({'error': 'Credenciales Invalidas'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error en el login: {e}")
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_email_recover(request):
    try:
        email = SendEmailRecoverDTO(data=request.data)

        if not email.is_valid():
            return Response(email.errors, status=status.HTTP_400_BAD_REQUEST)

        user_found = User.objects.filter(email=email.validated_data['email']).first()

        token, expiration = generate_token()
        Token.objects.filter(user=user_found).delete()
        Token.objects.create(user=user_found, token=token, date_expiration=expiration)

        send_recovery_email(email.validated_data['email'],token, user_found.name)

        return Response({'message': 'Se te ha enviado un correo para recuperar tu contraseña'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al enviar el correo de recuperación: {e}")
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_token(request):
    try:
        token = VerifyTokenDTO(data=request.data)

        if not token.is_valid():
            return Response(token.errors, status=status.HTTP_400_BAD_REQUEST)

        token_obj = token.validated_data['token_obj']

        return Response({'data': token_obj.user.id, 'message': 'Verificación exitosa'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al verificar el token: {e}")
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def change_password(request):
    try:
        credentials = ResetPasswordDTO(data=request.data)

        if not credentials.is_valid():
            return Response(credentials.errors, status=status.HTTP_400_BAD_REQUEST)

        user_found = User.objects.get(id=credentials.validated_data['user'])

        user_found.set_password(credentials.validated_data['new_password'])
        user_found.save()
        Token.objects.filter(user=user_found).delete()

        return Response({'message': 'Contraseña restablecida correctamente'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error al cambiar la contraseña: {e}")
        return Response({'error': 'Ha ocurrido un error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)