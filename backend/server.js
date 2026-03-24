const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5177",
  credentials: true
}));

app.use(express.json());

app.use("/api/users", require("./src/routes/userRoutes"));

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

app.listen(4000, () => {
  console.log("listening on port 4000");
});