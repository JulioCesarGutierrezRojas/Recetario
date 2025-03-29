from rest_framework import serializers
from .models import User, Sex


class RegisterUserDTO(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    name = serializers.CharField()
    sex = serializers.ChoiceField(choices=Sex.choices)

    def validate_email(self, value):
        if User.objects.filter(email=value).first():
            raise serializers.ValidationError("Este correo ya esta registrado")

        return value