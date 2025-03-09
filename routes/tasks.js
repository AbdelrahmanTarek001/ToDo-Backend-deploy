const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Get all tasks for a user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Create a new task
router.post('/', auth, async (req, res) => {
    try {
        const { text, details, priority } = req.body;
        const task = new Task({
            text,
            details,
            priority,
            user: req.user.userId
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { text, details, completed, priority } = req.body;
        
        if (text) task.text = text;
        if (details !== undefined) task.details = details;
        if (completed !== undefined) task.completed = completed;
        if (priority) task.priority = priority;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router; 