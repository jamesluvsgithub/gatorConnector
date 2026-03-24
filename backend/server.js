const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

console.log("CLIENT_URL =", process.env.CLIENT_URL);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

const userRoutes = require("./src/routes/userRoutes");
const goalRoutes = require("./src/routes/goalRoutes");

app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});