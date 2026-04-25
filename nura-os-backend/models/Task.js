import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  priority: String,
});

export default mongoose.model("Task", taskSchema);