import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatModel from "./model/chat.model";
import connectdb from "./db";

connectdb();

dotenv.config();
const port = 3030;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Route to check if the place exists in the database
app.get("/api/content/:place", async (req: Request, res: Response): Promise<any> => {
  const { place } = req.params;
  try {
    const isthere = await chatModel.findOne({ place: place.toLowerCase() });

    if (isthere) {
      return res.status(200).json({ success: true, message: isthere.content });
    }

    return res.status(404).json({ success: false, message: "Content not found" });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching content",
      error: error.message || "Unknown error",
    });
  }
});

// Route to generate content if not found
app.post("/api/generate", async (req: Request, res: Response): Promise<any> => {
  const model = process.env.CONTENT_GENERATION_MODEL;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!model || !apiToken) {
    return res.status(500).json({
      success: false,
      message: "Missing environment variables: CONTENT_GENERATION_MODEL or CLOUDFLARE_API_TOKEN",
    });
  }

  const { place }: { place: string } = req.body;
  if (!place) {
    return res.status(400).json({ success: false, message: "Place is required" });
  }

  try {
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/a08822ecd78ffb3acede87da0e234c0e/ai/run/${model}`;

    const requestBody = {
      messages: [
        { role: "system", content: "You are a friendly assistant" },
        { role: "user", content: `Generate the history of ${place}, include historical places, culture, events, and geography with proper headings.` },
      ],
      max_tokens: 2048,
    };


    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response Error:", errorText);
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format (not JSON)");
    }

    const data = await response.json();
    
    await chatModel.create({
      place: place.toLowerCase(),
      content: data.result.response,
    });

    return res.status(200).json({ success: true, content: data.result.response});
  } catch (error: any) {
    console.error("Error generating content:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error while generating content",
      error: error.message || "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});