import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const bikes = [
  { id: 1, name: "Hunter 350", brand: "Royal Enfield", price: 164000 },
  { id: 2, name: "Classic 350", brand: "Royal Enfield", price: 200000 },
  { id: 3, name: "Xpulse 200", brand: "Hero", price: 136000 }
];


app.get("/api/bikes", (req, res) => {
  res.json(bikes);
});


app.get("/api/bikes/:id", (req, res) => {
  const bike = bikes.find(b => b.id === parseInt(req.params.id));
  if (!bike) return res.status(404).json({ error: "Bike not found" });
  res.json(bike);
});


app.post("/api/bikes", (req, res) => {
  const { name, brand, price } = req.body;
  if (!name || !brand || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newBike = { id: bikes.length + 1, name, brand, price };
  bikes.push(newBike);
  res.status(201).json(newBike);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
