import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка уведомления об обращении из формы КотоДом на email владельца."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    contact = body.get('contact', '').strip()
    contact_type = body.get('contact_type', 'email')
    message = body.get('message', '').strip()

    if not name or not contact or not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните все поля'})
        }

    smtp_host = os.environ['SMTP_HOST']
    smtp_port = int(os.environ['SMTP_PORT'])
    smtp_user = os.environ['SMTP_USER']
    smtp_password = os.environ['SMTP_PASSWORD']
    notify_email = os.environ['NOTIFY_EMAIL']

    contact_label = 'Email' if contact_type == 'email' else 'Telegram'

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff7ed; padding: 24px; border-radius: 16px;">
      <h2 style="color: #ea580c; margin-bottom: 4px;">🐾 Новое обращение из КотоДом</h2>
      <p style="color: #78716c; font-size: 14px; margin-top: 0;">Кто-то хочет уютный домик для своего котика!</p>
      <hr style="border: none; border-top: 1px solid #fed7aa; margin: 16px 0;" />
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #a8a29e; font-size: 13px; width: 140px;">Имя</td>
          <td style="padding: 8px 0; color: #1c1917; font-weight: bold;">{name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #a8a29e; font-size: 13px;">{contact_label}</td>
          <td style="padding: 8px 0; color: #1c1917; font-weight: bold;">{contact}</td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #fed7aa; margin: 16px 0;" />
      <p style="color: #a8a29e; font-size: 13px; margin-bottom: 6px;">Сообщение:</p>
      <p style="color: #1c1917; background: white; padding: 12px 16px; border-radius: 10px; border-left: 3px solid #ea580c; margin: 0;">{message}</p>
      <p style="color: #d4c4a8; font-size: 11px; margin-top: 20px; text-align: center;">КотоДом — Дом, в котором мурчат от счастья 😺</p>
    </div>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'🐾 Новое обращение от {name} — КотоДом'
    msg['From'] = smtp_user
    msg['To'] = notify_email
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, notify_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
