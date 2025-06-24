from django.urls import path
from . import views

urlpatterns = [
    path('records/', views.HealthRecordListCreateView.as_view(), name='health-record-list-create'),
    path('records/<int:pk>/', views.HealthRecordDetailView.as_view(), name='health-record-detail'),
]
