const request = require('supertest');
const Task = require('../models/Task');
const app = require('../app');

// Mocks
jest.mock('../models/Task');
jest.mock('../middleware/auth', () => require('./mocks/authMiddleware'));

describe('TaskController', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Mock data for tests
    const mockTask = {
        _id: 'mockTaskId',
        title: 'Task Title',
        description: 'Task description',
        dueDate: new Date(),
        user: 'mockUserId',
        // Mock the save method for the task that returns from the findById
        save: jest.fn().mockResolvedValueOnce({
            _id: 'mockTaskId',
            title: 'Updated Task',
            description: 'Updated description',
            dueDate: new Date(),
            user: 'mockUserId',
            completed: false,
        }),
        // Mock deleteOne method for the task that returns from the findById
        deleteOne: jest.fn().mockResolvedValueOnce({}),
    };

    const updateTask = {
        title: 'Updated Task',
        description: 'Updated description',
        dueDate: new Date(),
        completed: false,
    }

    describe('createTask', () => {
        const newTaskData = {
            title: 'New Task',
            description: 'Task description',
            dueDate: new Date()
        }
        it('should create a new task', async () => {
            Task.prototype.save.mockResolvedValueOnce({ ...newTaskData, user: "mockUserId" }); // Save mock task

            const response = await request(app)
                .post('/tasks')
                .send(newTaskData);

            expect(response.status).toBe(201);
            // Check if the response has the needed data
            expect(response.body.title).toBe('New Task');
            expect(response.body.description).toBe('Task description');
            expect(response.body).toHaveProperty('dueDate');
            expect(response.body.user).toBe('mockUserId');
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', async () => {
            Task.findById.mockResolvedValueOnce(mockTask); // Mock finding task

            const response = await request(app)
                .put(`/tasks/${mockTask._id}`)
                .send(updateTask);

            expect(response.status).toBe(200);
            // Check if the response has the updated data
            expect(response.body.title).toBe('Updated Task');
            expect(response.body.description).toBe('Updated description');
            expect(response.body).toHaveProperty('dueDate');
        });

        it('should return 403 if the user id is not the same as the user id that created the task', async () => {
            Task.findById.mockResolvedValueOnce({ ...mockTask, user: "UnauthorizedUserId" }); // Mock finding task

            const response = await request(app)
                .put(`/tasks/${mockTask._id}`)
                .send(updateTask);

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Unauthorized');
        });

        it('should return 404 if target task to be updated is not found', async () => {
            Task.findById.mockResolvedValueOnce(null); //Task does not exist

            const response = await request(app)
                .put(`/tasks/${mockTask._id}`)
                .send(updateTask);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Task not found');
        });
    });

    describe('deleteTask', () => {
        it('should delete an existing task', async () => {
            Task.findById.mockResolvedValueOnce(mockTask); // Mock finding task

            const response = await request(app)
                .delete(`/tasks/${mockTask._id}`)
                .send();

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Task deleted successfully');
        });

        it('should return 403 if the user id is not the same as the user id that created the task', async () => {
            Task.findById.mockResolvedValueOnce({ ...mockTask, user: "UnauthorizedUserId" }); // Mock finding task

            const response = await request(app)
                .delete(`/tasks/${mockTask._id}`)
                .send();

            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Unauthorized');
        });

        it('should return 404 if target task to be deleted is not found', async () => {
            Task.findById.mockResolvedValueOnce(null); //Task does not exist

            const response = await request(app)
                .delete(`/tasks/${mockTask._id}`)
                .send();

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Task not found');
        });
    });
});
