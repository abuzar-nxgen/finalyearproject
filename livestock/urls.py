from django.urls import path
from . import views

urlpatterns = [
    path('', views.LivestockListCreateView.as_view(), name='livestock-list-create'),
    path('<int:pk>/', views.LivestockDetailView.as_view(), name='livestock-detail'),
    path('stats/', views.livestock_stats, name='livestock-stats'),
    path('health-check/', views.health_check, name='health-check'),
]
