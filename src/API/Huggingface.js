// Huggingface.js (now Gemini image generator)
import { prevUser } from "../Context/UserContext";

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${import.meta.env.VITE_KEY1}`;

export async function query() {
  if (!prevUser.prompt) return null;

  const payload = {
    contents: [
      {
        parts: [{ text: prevUser.prompt }],
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
    console.log("Gemini Image API Response:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown API Error");
    }

    // Extract base64 image data
    const base64Image =
      data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;

    if (!base64Image) {
      console.error("No image returned from Gemini API");
      return null;
    }

    // Convert base64 to a blob URL for display in React
    const binary = atob(base64Image);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("Error generating Gemini image:", error);
    return null;
  }
}
