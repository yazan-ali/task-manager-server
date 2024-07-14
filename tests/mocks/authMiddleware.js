module.exports = (req, res, next) => {
    req.user = { id: 'mockUserId' }; // Mock user id
    next();
};