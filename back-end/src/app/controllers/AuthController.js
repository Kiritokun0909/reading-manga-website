// src/app/controllers/AuthController.js
const authService = require('../services/AuthService.js');
const { generateToken } = require('../../middlewares/jwtMiddleware.js');

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authService.login(email, password);

        if(result && result.code == authService.LOGIN_FAILED_CODE) {
            res.status(401).json({ message: result.message });
            return;
        }

        if(result && result.code == authService.LOGIN_SUCCESS_CODE) {
            const token = generateToken(result.userId, result.roleId);
            res.status(200).json({ message: result.message, token: token, roleId: result.roleId });
            return;
        }

    } catch (err) {
        console.log('Failed to login account:', err);
        res.status(500).json({ message: 'Failed to login account. Please try again later.' });
    }
}

class AuthController {
    // [POST] /auth/login
    async login(req, res) {
        return await loginUser(req, res);
    }

    // [GET] /auth/logout
    async logout(req, res) {
        res.status(200).json({ message: 'Logout successfully.' });
    }
}

module.exports = new AuthController;