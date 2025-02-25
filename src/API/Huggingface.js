import axios from "axios";
import { prevUser } from "../Context/UserContext";


export async function query() {
    try {
        const response = await axios.post(
            "https://router.huggingface.co/hf-inference/models/ZB-Tech/Text-to-Image",
            { inputs: prevUser.prompt },
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_ACCESSTOKEN}`,
                    "Content-Type": "application/json",
                },
                responseType: "blob",
            }
        );

        console.log("Image received:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching image:", error.response?.data || error.message);
        return null;
    }
}