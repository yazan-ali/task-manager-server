const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateAuthInputs } = require('../utils/validators');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "1h" }
    )
}

const signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        validateAuthInputs(username, password);
        const userDoesExist = await User.findOne({ username });
        if (userDoesExist) {
            return res.status(400).json({ error: 'User already exist' })
        }
        const user = new User({ username, password });
        await user.save();
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        validateAuthInputs(username, password);
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { signup, login };