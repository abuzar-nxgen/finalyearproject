from rest_framework import serializers
from .models import Livestock

class LivestockSerializer(serializers.ModelSerializer):
    age_in_days = serializers.ReadOnlyField()
    age_in_months = serializers.ReadOnlyField()
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Livestock
        fields = [
            'id', 'tag_number', 'animal_type', 'breed', 'gender', 
            'birth_date', 'weight', 'status', 'purchase_price', 
            'purchase_date', 'notes', 'owner', 'owner_name',
            'age_in_days', 'age_in_months', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at', 'owner')

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class LivestockStatsSerializer(serializers.Serializer):
    total_livestock = serializers.IntegerField()
    by_type = serializers.DictField()
    by_status = serializers.DictField()
    healthy_count = serializers.IntegerField()
    sick_count = serializers.IntegerField()
