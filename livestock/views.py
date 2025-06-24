from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from .models import Livestock
from .serializers import LivestockSerializer, LivestockStatsSerializer

class LivestockListCreateView(generics.ListCreateAPIView):
    serializer_class = LivestockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Livestock.objects.all()
        return Livestock.objects.filter(owner=user)

class LivestockDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LivestockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Livestock.objects.all()
        return Livestock.objects.filter(owner=user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def livestock_stats(request):
    user = request.user
    
    if user.is_admin:
        queryset = Livestock.objects.all()
    else:
        queryset = Livestock.objects.filter(owner=user)
    
    total_livestock = queryset.count()
    
    by_type = dict(queryset.values_list('animal_type').annotate(count=Count('animal_type')))
    by_status = dict(queryset.values_list('status').annotate(count=Count('status')))
    
    healthy_count = queryset.filter(status='healthy').count()
    sick_count = queryset.filter(status='sick').count()
    
    stats = {
        'total_livestock': total_livestock,
        'by_type': by_type,
        'by_status': by_status,
        'healthy_count': healthy_count,
        'sick_count': sick_count,
    }
    
    serializer = LivestockStatsSerializer(stats)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def health_check(request):
    return Response({
        'status': 'healthy',
        'message': 'Livestock Management API is running',
        'user': request.user.username if request.user.is_authenticated else 'Anonymous'
    })
