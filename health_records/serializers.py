from rest_framework import serializers
from .models import HealthRecord
from livestock.serializers import LivestockSerializer

class HealthRecordSerializer(serializers.ModelSerializer):
    livestock_info = LivestockSerializer(source='livestock', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = HealthRecord
        fields = [
            'id', 'livestock', 'livestock_info', 'record_type', 'date',
            'veterinarian', 'diagnosis', 'treatment', 'medication',
            'cost', 'notes', 'next_appointment', 'created_by',
            'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
