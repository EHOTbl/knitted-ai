import express from "express";
import multer from "multer";
import Replicate from "replicate";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.post("/api/generate", upload.single("image"), async (req, res) => {
  try {
    const prompt = `
Use the uploaded image as a primary reference and create a handmade thread art piece, winter snow composition. a Tilt-Shift diorama made of yarn and felt. Add knitted clouds, snowflakes, people and cars. Macro photography, warm soft diffused light, pastel palette, high-detailed fibers and stitches, a cozy, fairytale atmosphere, and a slightly reduced scale, like a Tilt-Shift diorama
`;

    const output = await replicate.run(
      "stability-ai/sdxl:latest",
      {
        input: {
          image: fs.createReadStream(req.file.path),
          prompt: prompt
        }
      }
    );

    res.json({ url: output[0] });
  } catch (e) {
    console.error(e);
    res.json({ error: true });
  }
});

app.listen(3000, () => console.log("Server started on 3000"));
