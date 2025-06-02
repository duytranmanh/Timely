from rest_framework import serializers

from activities.models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Activity
        fields = '__all__'