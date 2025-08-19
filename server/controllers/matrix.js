import dotenv from "dotenv";
dotenv.config();

export const getMatrix = async (req, res) => {
  const { coords } = req.query;
  const accessToken = process.env.ACCESS_TOKEN;

  const matrixURL = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coords}?access_token=${accessToken}`;

  try {
    const response = await fetch(matrixURL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matrix data" });
  }
};
