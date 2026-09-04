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
# app/tools/calendar_tool.py — add this function

@tool
def create_calendar_event(summary: str, start_time: str, end_time: str, description: str = "") -> str:
    """Create a new Google Calendar event. start_time and end_time must be
    ISO 8601 format with timezone offset, e.g. '2026-09-05T14:00:00+05:30'.
    Use this when the user asks to schedule, add, or book something on their calendar."""
    creds = get_google_credentials()
    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": summary,
        "description": description,
        "start": {"dateTime": start_time},
        "end": {"dateTime": end_time},
    }

    try:
        created = service.events().insert(calendarId="primary", body=event).execute()
    except Exception as e:
        return f"Failed to create event: {e}"

    return f"Event '{summary}' created for {start_time}. Link: {created.get('htmlLink')}"
if __name__ == "__main__":
    print(create_calendar_event.invoke({
        "summary": "Test Event", "start_time": "2026-09-05T14:00:00+05:30", "end_time": "2026-09-05T15:00:00+05:30"
    }))