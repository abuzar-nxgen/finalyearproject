from django.db import models
from django.contrib.auth import get_user_model
from livestock.models import Livestock

User = get_user_model()

class HealthRecord(models.Model):
    RECORD_TYPES = [
        ('vaccination', 'Vaccination'),
        ('treatment', 'Treatment'),
        ('checkup', 'Regular Checkup'),
        ('injury', 'Injury'),
        ('illness', 'Illness'),
        ('other', 'Other'),
    ]

    livestock = models.ForeignKey(Livestock, on_delete=models.CASCADE, related_name='health_records')
    record_type = models.CharField(max_length=20, choices=RECORD_TYPES)
    date = models.DateField()
    veterinarian = models.CharField(max_length=100, blank=True)
    diagnosis = models.TextField()
    treatment = models.TextField()
    medication = models.CharField(max_length=200, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    next_appointment = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.livestock.tag_number} - {self.record_type} ({self.date})"
