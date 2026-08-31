from dotenv import load_dotenv
load_dotenv()
import os

OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY")
GITHUB_TOKEN=os.getenv("GITHUB_TOKEN")
GROQ_API_KEY=os.getenv("GROQ_API_KEY")
SLACK_BOT_TOKEN=os.getenv("SLACK_BOT_TOKEN")