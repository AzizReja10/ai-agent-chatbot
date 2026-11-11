const { googleApi } = require("./google_auth");

const getGoogleProfileSchema = {
  type: "function",
  function: {
    name: "get_google_profile",
    description:
      "Get the signed-in user's Google profile, including their name and email address. Use this when they ask what name or email address is associated with their connected Google account.",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
};

async function getGoogleProfile() {
  try {
    const profile = await googleApi("https://www.googleapis.com/oauth2/v2/userinfo");
    const details = [];
    if (profile.name) details.push(`Name: ${profile.name}`);
    if (profile.email) details.push(`Email: ${profile.email}`);
    return details.length
      ? details.join("\n")
      : "Google did not return a name or email for this account.";
  } catch (error) {
    return `Could not retrieve your Google profile: ${error.message}`;
  }
}

module.exports = { getGoogleProfile, getGoogleProfileSchema };
