const { googleApi } = require("./google_auth");

const listUpcomingEventsSchema = {
  type: "function",
  function: {
    name: "list_upcoming_events",
    description: "List the user's upcoming Google Calendar events, soonest first.",
    parameters: {
      type: "object",
      properties: { max_results: { type: "integer", minimum: 1, maximum: 50 } },
      additionalProperties: false,
    },
  },
};

const createCalendarEventSchema = {
  type: "function",
  function: {
    name: "create_calendar_event",
    description: "Create a Google Calendar event.",
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string" },
        start_time: { type: "string", description: "ISO 8601 date/time with timezone" },
        end_time: { type: "string", description: "ISO 8601 date/time with timezone" },
        description: { type: "string" },
      },
      required: ["summary", "start_time", "end_time"],
      additionalProperties: false,
    },
  },
};

async function listUpcomingEvents({ max_results = 10 } = {}) {
  try {
    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    url.search = new URLSearchParams({
      timeMin: new Date().toISOString(),
      maxResults: String(Math.max(1, Math.min(50, max_results))),
      singleEvents: "true",
      orderBy: "startTime",
    });
    const result = await googleApi(url);
    return result.items?.length
      ? result.items.map((event) => {
          const start = event.start?.dateTime || event.start?.date || "(unknown time)";
          return `${start} - ${event.summary || "(no title)"}`;
        }).join("\n")
      : "No upcoming events found.";
  } catch (error) {
    return error.message;
  }
}

async function createCalendarEvent({
  summary,
  start_time,
  end_time,
  description = "",
}) {
  try {
    const created = await googleApi(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        body: JSON.stringify({
          summary,
          description,
          start: { dateTime: start_time },
          end: { dateTime: end_time },
        }),
      },
    );
    return `Event '${summary}' created for ${start_time}. Link: ${created.htmlLink || ""}`;
  } catch (error) {
    return `Failed to create event: ${error.message}`;
  }
}

module.exports = {
  createCalendarEvent,
  createCalendarEventSchema,
  listUpcomingEvents,
  listUpcomingEventsSchema,
};
