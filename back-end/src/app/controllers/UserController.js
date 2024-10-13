// src/app/controllers/AuthController.js
const userService = require("../services/UserService");

const registerAccount = async (req, res, role) => {
    const { username, email, password } = req.body;
    try {
        const result = await userService.register(username, email, password, role);
        
        if(result && result.code == userService.EMAIL_EXIST_CODE) {
            res.status(409).json({ message: result.message });
            return;
        }

        if(result && result.code == userService.REGISTER_SUCCESS_CODE) {
            res.status(201).json({ message: result.message });
            return;
        }

    } catch (err) {
        console.log('Failed to register account:', err);
        res.status(500).json({ message: 'Failed to register account. Please try again.' });
    }
}

class UserController {
    // [POST] /auth/register
    async registerUser(req, res) {
        return await registerAccount(req, res, userService.RoleEnum.USER);
    }

    // [POST] /auth/register-admin
    async registerAdmin(req, res) {
        return await registerAccount(req, res, userService.RoleEnum.ADMIN);
    }
}

module.exports = new UserController;