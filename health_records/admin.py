from django.contrib import admin
from .models import HealthRecord

@admin.register(HealthRecord)
class HealthRecordAdmin(admin.ModelAdmin):
    list_display = ('livestock', 'record_type', 'date', 'veterinarian', 'created_by', 'created_at')
    list_filter = ('record_type', 'date', 'created_at')
    search_fields = ('livestock__tag_number', 'veterinarian', 'diagnosis')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('livestock', 'record_type', 'date', 'veterinarian')
        }),
        ('Medical Details', {
            'fields': ('diagnosis', 'treatment', 'medication')
        }),
        ('Financial & Follow-up', {
            'fields': ('cost', 'next_appointment')
        }),
        ('Additional Information', {
            'fields': ('notes', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
