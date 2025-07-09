from rest_framework import serializers

from activities.models import Activity
from categories.models import Category
from categories.serializers import CategorySerializer


class ActivitySerializer(serializers.ModelSerializer):
    # MAKE AUTHOR READ ONLY
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    
    # RESPONSE WILL CONTAIN ALL INFORMATION ON A GIVEN CATEGORY
    category = CategorySerializer(read_only=True)
    
    # CATEGORY ID WILL ONLY BE WRITTEN
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, source="category"
    )

    class Meta:
        model = Activity
        fields = [
            "id",
            "start_time",
            "end_time",
            "category",
            "category_id",
            "author",
            "notes",
            "energy_level",
            "mood",
        ]

    def to_representation(self, instance):
        """
        Customize how Activity instance is serialized
        Replacing mood from a value to an Object with value and label
        """
        data = super().to_representation(instance)

        # REPLACE MOOD WITH MOOD OBJECT
        data["mood"] = {
            "value": instance.mood,
            "label": instance.get_mood_display()
        }

        return data

    def validate(self, data):
        """
        Validate whether new activity is in conflict of any existings timewise
        """
        # GET USER, START AND END TIME
        author = self.context["request"].user
        start = data["start_time"]
        end = data["end_time"]

        # GET ALL USER'S ACTIVITY WITHIN NEW ACTIVITY'S TIME FRAME
        overlapping_activities = Activity.objects.filter(
            author=author, start_time__lt=end, end_time__gt=start
        )

        # IF UPDATING (SELF.INSTANCE IS TRUE), EXCLUDE ITSELF
        if self.instance:
            overlapping_activities = overlapping_activities.exclude(id=self.instance.id)

        # IF OVERLAPPING_ACTIVITIES IS NOT EMPTY, RAISE ERROR
        if overlapping_activities.exists():
            raise serializers.ValidationError(
                "Activity times overlap with an existing activity."
            )

        return data
