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
            prompt: prevUser.prompt, // text prompt for the image
          },
        ],
        parameters: {
          sampleCount: 1, // number of images to generate
        },
      },
      {
        headers: {
          "x-goog-api-key": import.meta.env.VITE_KEY1, // your Gemini API key
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini Image API response:", response.data);

    // Extract the first generated image (base64)
    const base64Image = response.data.predictions?.[0]?.image?.content;

    if (!base64Image) return null;

    // Convert to data URL for <img>
    const imageUrl = `data:image/png;base64,${base64Image}`;
    return imageUrl;
  } catch (error) {
    console.error("Error generating Gemini image:", error.response?.data || error.message);
    return null;
  }
}
