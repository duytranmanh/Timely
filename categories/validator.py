from django.core.exceptions import ValidationError
import re

def validate_hex_color(value):
    if not re.match(r'^#([A-Fa-f0-9]{6})$', value):
        raise ValidationError(f'{value} is not a valid hex color code.')