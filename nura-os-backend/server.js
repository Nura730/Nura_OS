import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);
mongoose.connect("YOUR_MONGODB_URL");

app.get("/", (req, res) => {
  res.send("Nura OS Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});