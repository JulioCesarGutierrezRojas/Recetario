from django.urls import path
from .views import login, send_email_recover

urlpatterns = [
    path('login/', login, name='token_obtain'),
    path('password-recover/', send_email_recover, name='send_email_recover'),
]