import { prevUser } from "../Context/UserContext";

const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function Gemini() {
  try {
    // prepare payload properly
    const payload = {
      contents: [
        {
          parts: [
            { text: prevUser.prompt },
            ...(prevUser.data
              ? [
                  {
                    inlineData: {
                      mimeType: prevUser.mime_type,
                      data: prevUser.data,
                    },
                  },
                ]
              : []),
          ],
        },
      ],
    };

    // make POST request
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": import.meta.env.VITE_KEY1, // API key from .env
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return "Error: " + (data.error?.message || "Something went wrong");
    }

    // Extract AI text safely
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? text.replace(/\*\*(.*?)\*\*/g, "$1").trim() : "No response received.";

  } catch (error) {
    console.error("Gemini() Fetch Error:", error);
    return "Failed to reach Gemini API.";
  }
}

export default Gemini;
