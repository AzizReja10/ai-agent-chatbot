from langchain_core.tools import tool
from googleapiclient.discovery import build
from app.tools.google_auth import get_google_credentials
import base64
from email.mime.text import MIMEText
@tool
def list_recent_emails(max_results:int=5)->str:
    """List the user's most recent emails from their Gmail indox,showing sender and subject. Use this when user asks about recent emails,
    their inbox or messages from someone."""
    creds=get_google_credentials()
    service=build("gmail","v1",credentials=creds)
    results=service.users().messages().list(
        userId="me",maxResults=max_results
    ).execute()
    messages=results.get("messages",[])
    if not messages:
        return " no recent emails found."
    emails_lines=[]
    for msg in messages:
        msg_data=service.users().messages().get(
            userId="me",id=msg["id"],format="metadata",
            metadataHeaders=["From","Subject"]
        ).execute()
        headers=msg_data["payload"]["headers"]
        sender=next((h["value"] for h in headers if h["name"]=="From"),"Unknown Sender")
        subject=next((h["value"] for h in headers if h["name"]=="Subject"),"(no subject)")
        emails_lines.append(f"From: {sender} | Subject: {subject}")
    return "\n".join(emails_lines)
@tool
def draft_email(to:str,subject:str,body:str)->str:
    """prepare a draft email for the user to review. This does NOT send anything. Always call this function first and show the draft to the user;
    only call send_email after the user explicitly confirms"""
    return (
        f"Here is the drafted email:\n"
        f"To: {to}\n"
        f"Subject: {subject}\n"
        f"Body: {body}\n\n"
        f"Should I send this?"
    )
@tool
def send_email(to:str,subject:str,body:str)->str:
    """Actually send an email via Gmail. Only call this AFTER the user has explicitly confirmed a draft_email result- never call this on the first request to send an email.1
    """
    creds=get_google_credentials()
    service=build("gmail","v1",credentials=creds)
    message=MIMEText(body)
    message["to"]=to
    message["subject"]=subject
    raw=base64.urlsafe_b64encode(message.as_bytes()).decode()
    try:
        service.users().messages().send(userId="me", body={"raw": raw}).execute()
        return f"Email sent to {to}."
    except Exception as e:
        return f"Failed to send email: {e}"
if __name__ == "__main__":
    print(send_email.invoke({"to": "rejaaziz686@gmail.com", "subject": "Test", "body": "Testing the agent's send tool."}))