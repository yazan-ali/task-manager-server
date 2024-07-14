// server.js
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();


// mongoose connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB database connection established successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});