from django.contrib import admin
from .models import Livestock

@admin.register(Livestock)
class LivestockAdmin(admin.ModelAdmin):
    list_display = ('tag_number', 'animal_type', 'breed', 'gender', 'status', 'owner', 'created_at')
    list_filter = ('animal_type', 'gender', 'status', 'created_at')
    search_fields = ('tag_number', 'breed', 'owner__username')
    readonly_fields = ('created_at', 'updated_at', 'age_in_days', 'age_in_months')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('owner', 'tag_number', 'animal_type', 'breed', 'gender')
        }),
        ('Physical Details', {
            'fields': ('birth_date', 'weight', 'status')
        }),
        ('Financial Information', {
            'fields': ('purchase_price', 'purchase_date')
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'age_in_days', 'age_in_months'),
            'classes': ('collapse',)
        }),
    )
