const schema = {
  type: "function",
  function: {
    name: "get_weather",
    description:
      "Get current real weather conditions for a city. Always use for weather questions instead of web search.",
    parameters: {
      type: "object",
      properties: { city: { type: "string", description: "City name" } },
      required: ["city"],
      additionalProperties: false,
    },
  },
};

async function getWeather({ city }) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return "Weather service is not configured (OPENWEATHER_API_KEY is missing).";
  try {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.search = new URLSearchParams({ q: city, appid: apiKey, units: "metric" });
    const response = await fetch(url);
    if (response.status === 404) {
      return `Could not find weather data for '${city}'. Check the city name.`;
    }
    if (!response.ok) return `Weather service returned an unexpected error: ${response.status}`;
    const data = await response.json();
    return `Weather in ${city}: ${data.weather?.[0]?.description || "unknown"}, ${data.main.temp}°C (feels like ${data.main.feels_like}°C), humidity ${data.main.humidity}%.`;
  } catch (error) {
    return `Network error while contacting the weather service: ${error.message}`;
  }
}

module.exports = { getWeather, schema };
