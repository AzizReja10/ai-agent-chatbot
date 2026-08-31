from langchain_core.tools import tool
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from app.config  import SLACK_BOT_TOKEN
client=WebClient(token=SLACK_BOT_TOKEN)
@tool
def list_slack_channels()->str:
    """List the slack channel the bot has access to in the workspace."""
    try:
        response=client.conversations_list()
    except SlackApiError as e:
        return f"Slack api error {e.response}"
    channels=response.get("channels",[])
    if not channels:
        return "No channels found."
    channel_lines=[f"#{c['name']}" for c in channels]
    return "\n".join(channel_lines)
@tool
def draft_slack_message(channel:str,text:str)->str:
    """prepare a draft Slack message for the user to review. This does NOT send snything.
      Alaways call this first; only call send_slack_message after the user explicitly confirms."""
    return(
        f"Here is the drafted Slack message:\n"
        f"Channel: #{channel}\n"
        f"Message: {text}\n\n"
        f"Should I send this?"
    )
@tool
def send_slack_message(channel:str,text:str)->str:
    """Actually post a message to Slack. Only called internally after user confirmation - not exposed to the agent directly."""
    try:
        client.chat_postMessage(channel=channel,text=text)
        return f"Message sent to #{channel}"
    except SlackApiError as e:
        return f"Slack API error :{e.response["error"]}"
if __name__=="__main__":
    print(list_slack_channels.invoke({}))
