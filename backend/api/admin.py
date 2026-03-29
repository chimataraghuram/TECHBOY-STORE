from django.contrib import admin
from .models import CustomUser, Product, ClickTrack

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email')
    search_fields = ('username', 'email')

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'category')
    search_fields = ('name', 'category')
    list_filter = ('category',)

class ClickTrackAdmin(admin.ModelAdmin):
    list_display = ('product', 'source', 'timestamp')
    list_filter = ('source', 'timestamp')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ClickTrack, ClickTrackAdmin)
