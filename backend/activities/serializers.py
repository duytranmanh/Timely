from rest_framework import serializers

from activities.models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Activity
        fields = '__all__'

    def validate(self, data):
        author = self.context['request'].user
        start = data['start_time']
        end = data['end_time']

        # get all activities by this user within this time frame
        # if there exists activities within this range, raise error
        overlapping_activities = Activity.objects.filter(
            author=author,
            start_time__lt=end,
            end_time__gt=start
        )

        # Exclude self in case of update
        if self.instance:
            overlapping_activities = overlapping_activities.exclude(id=self.instance.id)

        if overlapping_activities.exists():
            raise serializers.ValidationError("Activity times overlap with an existing activity.")

        return data
