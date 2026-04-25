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
      "retro-diffusion/rd-plus",
      {
        input: {
          image: image,
          prompt: "pixel art character, full body, 16bit style, white background",
          style: "character",
          width: 256,
          height: 256,
          strength: 0.75,
          num_images: 1,
        }
      }
    );

    return res.status(200).json({ result: output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
