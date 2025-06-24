from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('permissions/', views.user_permissions, name='user_permissions'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
