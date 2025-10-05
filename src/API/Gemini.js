const LIST_MODELS_URL = "https://generativelanguage.googleapis.com/v1beta/models";

async function listModels() {
  const resp = await fetch(LIST_MODELS_URL, {
    headers: {
      "x-goog-api-key": import.meta.env.VITE_KEY1,
    },
  });
  const data = await resp.json();
  console.log("Available models:", data);
  return data;
}

async function Gemini() {
  // Suppose after listing you saw "gemini-2.0-flash" is valid
  const modelName = "gemini-2.0-flash"; // <— adjust after you check

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

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

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": import.meta.env.VITE_KEY1,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  console.log("Gemini response:", data);
  if (!response.ok) {
    throw new Error(data.error?.message || "Unknown API error");
  }
  return data.candidates[0].content.parts[0].text.trim();
}
