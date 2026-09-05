# app/tools/weather_tool.py
from langchain_core.tools import tool
import requests
from app.config import OPENWEATHER_API_KEY

@tool
def get_weather(city: str) -> str:
    """Get the current, real weather conditions (temperature, description,
    humidity) for a specific city. Always use this tool for any weather
    question — never use web search for weather, since this tool returns
    live, accurate data directly from a weather service."""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": OPENWEATHER_API_KEY, "units": "metric"}

    try:
        response = requests.get(url, params=params)
    except requests.exceptions.RequestException as e:
        return f"Network error while contacting the weather service: {e}"

    if response.status_code == 404:
        return f"Could not find weather data for '{city}'. Check the city name."
    elif response.status_code != 200:
        return f"Weather service returned an unexpected error: {response.status_code}"

    data = response.json()
    temp = data["main"]["temp"]
    feels_like = data["main"]["feels_like"]
    description = data["weather"][0]["description"]
    humidity = data["main"]["humidity"]

    return (
        f"Weather in {city}: {description}, {temp}°C (feels like {feels_like}°C), "
        f"humidity {humidity}%."
    )