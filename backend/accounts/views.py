from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserPermissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        permissions = {
            'is_admin': user.is_admin,
            'is_standard': user.is_standard,
            'dashboard_sections': self.get_dashboard_sections(user),
            'allowed_actions': self.get_allowed_actions(user),
        }
        return Response(permissions)
    
    def get_dashboard_sections(self, user):
        # Base sections available to all users
        sections = ['livestock_overview', 'health_records']
        
        # Admin-only sections
        if user.is_admin:
            sections.extend([
                'user_management', 
                'system_settings', 
                'advanced_reports',
                'financial_management',
                'breeding_management'
            ])
            
        return sections
    
    def get_allowed_actions(self, user):
        # Base actions for standard users
        actions = {
            'livestock': ['view'],
            'health_records': ['view', 'add'],
        }
        
        # Admin actions
        if user.is_admin:
            actions = {
                'livestock': ['view', 'add', 'edit', 'delete'],
                'health_records': ['view', 'add', 'edit', 'delete'],
                'users': ['view', 'add', 'edit', 'delete'],
                'settings': ['view', 'edit'],
                'reports': ['view', 'generate', 'export'],
                'financial': ['view', 'add', 'edit', 'delete'],
                'breeding': ['view', 'add', 'edit', 'delete'],
            }
            
        return actions
