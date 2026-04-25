const Replicate = require("replicate");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const output = await replicate.run(
      "adirik/stylize-anything:latest",
      {
        input: {
          image: image,
          prompt: "pixel art, 16bit style, clean pixel art, game character sprite, full body, white background",
          negative_prompt: "blurry, low quality, 3d render, photorealistic",
          strength: 0.75,
        }
      }
    );

    return res.status(200).json({ result: output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
