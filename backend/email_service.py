import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

if not all([SMTP_HOST, SMTP_EMAIL, SMTP_PASSWORD]):
    raise ValueError("SMTP configuration missing in .env")


def send_contact_email(name: str, email: str, message: str):
    subject = f"New Contact Message from {name}"

    body = f"""
    Name: {name}
    Email: {email}

    Message:
    {message}
    """

    msg = MIMEMultipart()
    msg["From"] = SMTP_EMAIL
    msg["To"] = SMTP_EMAIL
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print("SMTP ERROR:", e)
        return False
