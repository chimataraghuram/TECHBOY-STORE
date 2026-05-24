from django.contrib import admin
from .models import CustomUser, Product, ClickTrack, PriceAlert, PriceHistory, Watchlist

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

class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ('product', 'price', 'timestamp')
    search_fields = ('product__name',)
    list_filter = ('timestamp',)

class PriceAlertAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'target_price', 'is_active', 'created_at')
    search_fields = ('user__username', 'user__email', 'product__name')
    list_filter = ('is_active', 'created_at')

class WatchlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    search_fields = ('user__username', 'user__email', 'product__name')
    list_filter = ('created_at',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ClickTrack, ClickTrackAdmin)
admin.site.register(PriceHistory, PriceHistoryAdmin)
admin.site.register(PriceAlert, PriceAlertAdmin)
admin.site.register(Watchlist, WatchlistAdmin)
