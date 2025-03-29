from rest_framework import serializers
from django.utils import timezone

from users.models import User, Token


class LoginDTO(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class SendEmailRecoverDTO(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, data):
        if not User.objects.filter(email=data).exists():
            raise serializers.ValidationError("No existe un usuario con ese correo")
        return data

class VerifyTokenDTO(serializers.Serializer):
    token = serializers.CharField(max_length=10)

    def validate(self, data):
        token_str = data['token']
        token_obj = Token.objects.filter(token=token_str).first()

        if not token_obj:
            raise serializers.ValidationError("Token inválido")

        if token_obj.date_expiration < timezone.now():
            raise serializers.ValidationError("Token expirado")

        data['token_obj'] = token_obj
        return data

class ResetPasswordDTO(serializers.Serializer):
    user = serializers.IntegerField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Las contraseñas no coinciden")

        if not User.objects.filter(id=data['user']).exists():
            raise serializers.ValidationError("No existe ese usuario")

        return data

