from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Livestock(models.Model):
    ANIMAL_TYPES = [
        ('cattle', 'Cattle'),
        ('sheep', 'Sheep'),
        ('goat', 'Goat'),
        ('pig', 'Pig'),
        ('chicken', 'Chicken'),
        ('other', 'Other'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    STATUS_CHOICES = [
        ('healthy', 'Healthy'),
        ('sick', 'Sick'),
        ('pregnant', 'Pregnant'),
        ('sold', 'Sold'),
        ('deceased', 'Deceased'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='livestock')
    tag_number = models.CharField(max_length=50, unique=True)
    animal_type = models.CharField(max_length=20, choices=ANIMAL_TYPES)
    breed = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    birth_date = models.DateField()
    weight = models.DecimalField(max_digits=8, decimal_places=2, help_text="Weight in kg")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='healthy')
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    purchase_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.tag_number} - {self.animal_type} ({self.breed})"

    @property
    def age_in_days(self):
        from datetime import date
        return (date.today() - self.birth_date).days

    @property
    def age_in_months(self):
        return self.age_in_days // 30
