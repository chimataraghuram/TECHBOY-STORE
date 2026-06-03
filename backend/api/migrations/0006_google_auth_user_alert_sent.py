# Generated manually for production Google auth metadata.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_pricealert_alert_type_pricealert_current_price_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='google_id',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='pricealert',
            name='alert_sent',
            field=models.BooleanField(default=False),
        ),
    ]
