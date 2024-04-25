const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/get-image-details", async (req, res) => {
  console.log(req.body);
  const { publicId } = req.body;

  try {
    const response = await cloudinary.api.resource(publicId);
    console.log(response);
    const details = {
      imageSize: response.bytes,
      created_at: response.created_at,
    };
    res.json(details);
  } catch (error) {
    console.error("Error fetching image details:", error);
    res.status(500).send("Error");
  }
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
