from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('api', '0006_google_auth_user_alert_sent')]

    operations = [
        migrations.AddField(
            model_name='pricealert', name='last_notified_price',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='pricealert', name='last_notified_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddConstraint(
            model_name='pricealert',
            constraint=models.UniqueConstraint(fields=('email', 'product'), name='unique_price_alert_email_product'),
        ),
        migrations.AddIndex(
            model_name='pricealert',
            index=models.Index(fields=('email', 'product'), name='price_alert_email_product_idx'),
        ),
        migrations.AddIndex(
            model_name='pricealert',
            index=models.Index(fields=('product', 'is_active'), name='price_alert_product_active_idx'),
        ),
    ]
