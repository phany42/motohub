

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


let bikes = [
  { id: 1, slug: "hunter-350", name: "Hunter 350", brand: "Royal Enfield", price: 164000, bodyStyle: "Cruiser" },
  { id: 2, slug: "splendor-plus", name: "Splendor Plus", brand: "Hero", price: 80000, bodyStyle: "Commuter" }
];

app.get("/api/ping", (req, res) => {
  return res.status(200).json({ success: true, message: "pong" });
});


app.get("/api/bikes", (req, res) => {
  return res.status(200).json({ success: true, data: bikes });
});


app.get("/api/bikes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bike = bikes.find((b) => b.id === id);
  if (!bike) return res.status(404).json({ success: false, message: "Bike not found" });
  return res.status(200).json({ success: true, data: bike });
});

app.post("/api/bikes", (req, res) => {
  const { name, brand, price, bodyStyle, slug } = req.body;
  if (!name || !brand) return res.status(400).json({ success: false, message: "Missing required fields: name or brand" });

  const id = bikes.length ? Math.max(...bikes.map((b) => b.id)) + 1 : 1;
  const newBike = {
    id,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    name,
    brand,
    price: price || 0,
    bodyStyle: bodyStyle || ""
  };
  bikes.push(newBike);
  return res.status(201).json({ success: true, data: newBike });
});


app.put("/api/bikes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = bikes.findIndex((b) => b.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Bike not found" });

  const { name, brand, price, bodyStyle, slug } = req.body;
  if (!name || !brand) return res.status(400).json({ success: false, message: "PUT requires name and brand" });

  const updated = {
    id,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    name,
    brand,
    price: price || 0,
    bodyStyle: bodyStyle || ""
  };
  bikes[idx] = updated;
  return res.status(200).json({ success: true, data: updated });
});


app.patch("/api/bikes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bike = bikes.find((b) => b.id === id);
  if (!bike) return res.status(404).json({ success: false, message: "Bike not found" });

  Object.assign(bike, req.body); 
  return res.status(200).json({ success: true, data: bike });
});


app.delete("/api/bikes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLen = bikes.length;
  bikes = bikes.filter((b) => b.id !== id);
  if (bikes.length === initialLen) return res.status(404).json({ success: false, message: "Bike not found" });
  return res.status(200).json({ success: true, message: "Bike deleted" });
});

app.listen(PORT, () => {
  console.log(`✅ MotoHub API listening at http://localhost:${PORT}`);
});
