const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db")();

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

/* =========================
   CORS CONFIG (VERY IMPORTANT)
   ========================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://event-rsvp-mern.netlify.app",
      "https://event-rsvp-mern1.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   STATIC FILES (IMAGES)
   ========================= */
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

/* =========================
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
