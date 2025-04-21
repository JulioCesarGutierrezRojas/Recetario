import secrets
import string
from datetime import datetime, timedelta
from django.utils import timezone

from django.core.mail import send_mail
from django.conf import settings

def send_recovery_email(email, token, name):
    try:
        subject = "Restablecimiento de Contraseña"
        from_email = settings.EMAIL_HOST_USER
        to_email = [email]
        message_html = f"""
        <html>
          <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #cd0508;">Restablecimiento de Contraseña</h2>
              <p>Hola, {name}</p>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
              <div style="background-color: #f3f4f6; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem;">
                <p style="margin: 0;">Tu código de verificación es:</p>
                <h3 style="color: #cd0508; margin: 0.5rem 0;">{token}</h3>
              </div>
              <p style="margin-top: 1rem; color: #6b7280;">
                Si no solicitaste este cambio, por favor ignora este mensaje.<br>
                Este token expirará en 1 hora.
              </p>
              <p style="margin-top: 2rem;">Atentamente,<br>El equipo de Sabor & Punto</p>
            </div>
          </body>
        </html>
        """

        send_mail(
            subject=subject,
            from_email=from_email,
            message="",
            recipient_list=to_email,
            html_message=message_html,
            fail_silently=False,
        )
    except Exception as e:
        print(e)
        raise Exception("No se pudo enviar el correo")

def generate_token(length=5):
    alphabet = string.ascii_uppercase + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(length))
    expiration = timezone.now() + timedelta(hours=1)

    return token, expiration