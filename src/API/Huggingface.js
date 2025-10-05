import { prevUser } from "../Context/UserContext";
import axios from "axios";

const URL = "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict";

export async function query() {
  try {
    const response = await axios.post(
      URL,
      {
        instances: [
          {
            prompt: prevUser.prompt, // plain text prompt
          },
        ],
        parameters: {
          sampleCount: 1, // generate 1 image
          temperature: 1,  // optional
        },
      },
      {
        headers: {
          "x-goog-api-key": import.meta.env.VITE_KEY1,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini Image API response:", response.data);

    // Gemini returns base64 image here
    const base64Image = response.data.predictions?.[0]?.content?.[0]?.image;

    if (!base64Image) return null;

    // Convert to data URL for <img>
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Error generating Gemini image:", error.response?.data || error.message);
    return null;
  }
}
