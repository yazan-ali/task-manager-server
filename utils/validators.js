validateAuthInputs = (username, password) => {
    if (username.trim() === "") {
        throw new Error("Username can not be empty")
    }
    if (password.trim() === "") {
        throw new Error("Password can not be empty")
    }
}

validateTaskInputs = (title, description, dueDate) => {
    if (title.trim() === "") {
        throw new Error("Title can not be empty")
    }
    if (description.trim() === "") {
        throw new Error("Description can not be empty")
    }
    if (dueDate === null) {
        throw new Error("Due date can not be empty")
    } else {
        // check if the dueDate is before today date
        const today = new Date().setHours(0, 0, 0, 0); // Set to the start of today
        const targetDueDate = new Date(dueDate).setHours(0, 0, 0, 0);
        if (targetDueDate < today) {
            throw new Error("Due date can be set at least to today date")
        }
    }
}

module.exports = { validateAuthInputs, validateTaskInputs }