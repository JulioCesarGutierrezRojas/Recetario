from django.urls import path
from .views import login, send_email_recover, verify_token, change_password

urlpatterns = [
    path('login/', login, name='token_obtain'),
    path('password-recover/', send_email_recover, name='send_email_recover'),
    path('verify-token/', verify_token, name='verify_token'),
    path('change-password/', change_password, name='change_password')
]