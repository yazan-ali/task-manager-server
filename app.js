// app.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hiiiiiiiii")
});


// Routes
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

module.exports = app;