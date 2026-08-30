from langchain_core.tools import tool
from googleapiclient.discovery import build
from app.tools.google_auth import get_google_credentials
from datetime import datetime,timezone

@tool
def list_upcoming_events(max_results:int=10)->str:
    """List the user's upcoming Google Calender events,soonest first."""
    creds=get_google_credentials()
    service=build("calendar","v3",credentials=creds)
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    results=service.events().list(
        calendarId="primary",
        timeMin=now,
        maxResults=max_results,
        singleEvents=True,
        orderBy="startTime"
    ).execute()
    events=results.get("items",[])
    if not events:
        return "No upcoming events found."
    event_lines=[]
    for event in events:
        start=event["start"].get("dateTime",event["start"].get("date"))
        summary=event.get("summary","(no title)")
        event_lines.append(f"{start} - {summary}")
    return "\n".join(event_lines)
if __name__=="__main__":
    print(list_upcoming_events.invoke({}))