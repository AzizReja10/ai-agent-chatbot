const schema = {
  type: "function",
  function: {
    name: "web_search",
    description:
      "Search the web for current information, news, and general knowledge. Do not use for weather, personal accounts, or GitHub repository information.",
    parameters: {
      type: "object",
      properties: { query: { type: "string", description: "Search query" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
};

function decodeHtml(text) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function webSearch({ query }) {
  try {
    const url = new URL("https://html.duckduckgo.com/html/");
    url.searchParams.set("q", query);
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AIChatbot/1.0)" },
    });
    if (!response.ok) return `Web search returned an unexpected error: ${response.status}`;
    const html = await response.text();
    const results = [...html.matchAll(/<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)]
      .slice(0, 6)
      .map((match) => `${decodeHtml(match[1])}: ${decodeHtml(match[2])}`);
    return results.length ? results.join("\n") : "No web search results were found.";
  } catch (error) {
    return `Network error while searching the web: ${error.message}`;
  }
}

module.exports = { schema, webSearch };
