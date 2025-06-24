from rest_framework import viewsets, permissions
from .models import Livestock, HealthRecord
from .serializers import LivestockSerializer, HealthRecordSerializer
from .permissions import AdminOrReadOnly, IsAdminUser

class LivestockViewSet(viewsets.ModelViewSet):
    serializer_class = LivestockSerializer
    permission_classes = [permissions.IsAuthenticated, AdminOrReadOnly]
    
    def get_queryset(self):
        queryset = Livestock.objects.all()
        
        # Filter by type if provided
        livestock_type = self.request.query_params.get('type', None)
        if livestock_type:
            queryset = queryset.filter(type=livestock_type)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save()

class HealthRecordViewSet(viewsets.ModelViewSet):
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = HealthRecord.objects.all()
        
        # Filter by livestock if provided
        livestock_id = self.request.query_params.get('livestock', None)
        if livestock_id:
            queryset = queryset.filter(livestock_id=livestock_id)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save()
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsAdminUser]
        return super().get_permissions()
