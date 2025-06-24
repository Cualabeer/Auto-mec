// server/server.js - Express API
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = "server/db.json";

const getBookings = () => {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE));
};

app.get("/api/bookings", (req, res) => {
  res.json(getBookings());
});

app.post("/api/bookings", (req, res) => {
  const bookings = getBookings();
  bookings.push(req.body);
  fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
  res.status(201).json({ message: "Booking saved" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
