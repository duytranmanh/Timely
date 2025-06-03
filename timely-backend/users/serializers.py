from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Read only serializer for the User model
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for all authentication, authorization processes involving User model
    """
    password = serializers.CharField(write_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]


    def create(self, validated_data):
        """
        Create and return a new User using Django create_user function(automatic password hashing)
        """
        return User.objects.create_user(**validated_data)
