from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from categories.models import Category
from django.contrib.auth.models import User

class Activity(models.Model):
    MOOD_CHOICES = [
        # Positive moods
        ('happy', 'Happy'),
        ('excited', 'Excited'),
        ('content', 'Content'),
        ('grateful', 'Grateful'),
        ('motivated', 'Motivated'),
        ('peaceful', 'Peaceful'),

        # Neutral moods
        ('neutral', 'Neutral'),
        ('tired', 'Tired'),
        ('bored', 'Bored'),
        ('indifferent', 'Indifferent'),

        # Negative moods
        ('sad', 'Sad'),
        ('anxious', 'Anxious'),
        ('stressed', 'Stressed'),
        ('overwhelmed', 'Overwhelmed'),
        ('angry', 'Angry'),
        ('lonely', 'Lonely'),
        ('frustrated', 'Frustrated'),
        ('fearful', 'Fearful'),
        ('guilty', 'Guilty')
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    notes = models.TextField(max_length=2000, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    energy_level = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)

    def __str__(self):
        return f'{self.category.name} {self.author.username}'