from rest_framework import generics, permissions
from .models import HealthRecord
from .serializers import HealthRecordSerializer

class HealthRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return HealthRecord.objects.all()
        return HealthRecord.objects.filter(livestock__owner=user)

class HealthRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HealthRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return HealthRecord.objects.all()
        return HealthRecord.objects.filter(livestock__owner=user)
