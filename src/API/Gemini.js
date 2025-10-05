import { prevUser } from "../Context/UserContext";

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_KEY1}`;

async function Gemini() {
  const payload = {
    contents: [
      {
        parts: [
          { text: prevUser.prompt },
          ...(prevUser.data
            ? [
                {
                  inline_data: {
                    mime_type: prevUser.mime_type,
                    data: prevUser.data,
                  },
                },
              ]
            : []),
        ],
      },
    ],
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Gemini API Response:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown API Error");
    }

    const apiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/\*\*(.*?)\*\*/g, "$1")
        ?.trim() || "No response text found.";

    return apiResponse;
  } catch (e) {
    console.error("Gemini API Error:", e);
    return "Something went wrong with Gemini API request.";
  }
}

export default Gemini;
