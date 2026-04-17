const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

const userRoutes = require("./src/routes/userRoutes");
const goalRoutes = require("./src/routes/goalRoutes");
const facultyRoutes = require("./src/routes/facultyRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const matchingRoutes = require("./src/routes/matchingRoutes");

app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/matching", require("./src/routes/matchingRoutes"));

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});