module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    const response = await fetch(
      "https://api-inference.huggingface.co/models/nerijs/pixel-art-xl",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: imageBuffer,
      }
    );
    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }
    const arrayBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(arrayBuffer).toString("base64");
    const resultUrl = `data:image/png;base64,${resultBase64}`;
    return res.status(200).json({ result: resultUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
