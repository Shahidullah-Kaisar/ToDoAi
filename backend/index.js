import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    createdAt: { type: Date, default: Date.now }, // Task creation time
    alarmTime: Date // Add alarm time field
});

const Task = mongoose.model("Task", taskSchema);

app.get("/get-tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

app.post("/add-task", async (req, res) => {
    const { text, alarmTime } = req.body; // Destructure alarmTime from the request body
    try {
        const newTask = new Task({ text, completed: false, alarmTime });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error adding task" });
    }
});

app.put("/update-task/:id", async (req, res) => {
    try {
        const { text, completed, alarmTime } = req.body; 
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { text, completed, alarmTime }, 
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating task" });
    }
});


app.delete("/delete-task/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task" });
    }
});


app.get('/',(req,res) =>{
    res.send("Server running good");
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})