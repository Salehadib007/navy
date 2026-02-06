import axios from "axios";
import FormData from "form-data";

export const uploadToImageBB = async (buffer, filename = "image.jpg") => {
  try {
    const apiKey = process.env.IMAGEBB_API_KEY;
    if (!apiKey) throw new Error("IMAGEBB_API_KEY missing in env");

    const form = new FormData();
    form.append("image", buffer.toString("base64"));
    form.append("name", filename);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      },
    );

    const imageUrl = res?.data?.data?.url;
    if (!imageUrl) throw new Error("ImageBB did not return image URL");

    return imageUrl;
  } catch (err) {
    console.log("IMAGEBB ERROR:", err?.response?.data || err.message);
    throw err;
  }
};
