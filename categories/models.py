from django.db import models
from django.contrib.auth.models import User
from .validator import validate_hex_color

class Category(models.Model):
    name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    color = models.CharField(validators=[validate_hex_color], max_length=7)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        owner = "default" if self.is_default else (self.user.username if self.user else "unknown")
        return f'{self.name} ({owner})'
