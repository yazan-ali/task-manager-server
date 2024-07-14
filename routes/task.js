const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task');
const isAuthorized = require('../middleware/auth');

const router = express.Router();

router.get('/', isAuthorized, getTasks);
router.post('/', isAuthorized, createTask);
router.put('/:id', isAuthorized, updateTask);
router.delete('/:id', isAuthorized, deleteTask);

module.exports = router;
