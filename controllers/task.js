const Task = require('../models/Task');
const getQueryItems = require('../utils/getQueryItems');
const { validateTaskInputs } = require('../utils/validators');

const getTasks = async (req, res) => {
    const { filter, sortBy, searchTerm } = req.query;
    const userId = req.user.id;
    const { query, sortQuery } = getQueryItems(userId, filter, sortBy, searchTerm);

    try {
        const tasks = await Task.find(query).sort(sortQuery);
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;
    const userId = req.user.id;

    if (!userId) {
        return res.status(403).json({ error: "Unauthorized" })
    }

    try {
        validateTaskInputs(title, description, dueDate);
        const task = new Task({ title, description, dueDate, user: userId });
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, completed, dueDate } = req.body;
    const userId = req.user.id;

    try {
        validateTaskInputs(title, description, dueDate);

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Check if the logged-in user is the creator of the task
        if (task.user.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        task.title = title;
        task.description = description;
        task.completed = completed;
        task.dueDate = dueDate;

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Check if the logged-in user is the creator of the task
        if (task.user.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await task.deleteOne({ _id: id });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };