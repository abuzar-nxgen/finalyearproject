# Add this to your Django views.py file

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    A simple health check endpoint to verify API connectivity
    """
    return Response({
        'status': 'ok',
        'message': 'API is running correctly',
        'version': '1.0.0',
    })

# Then add this to your urls.py:
# path('api/health-check/', views.health_check, name='health_check'),
