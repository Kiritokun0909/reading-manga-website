// src/app/controllers/AuthController.js
const authService = require('../services/AuthService.js');
const { generateToken } = require('../../middlewares/jwtMiddleware.js');
const HandleCode = require('../../utilities/HandleCode.js');

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

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authService.login(email, password);

        if(result && result.code == HandleCode.LOGIN_FAILED) {
            res.status(401).json({ message: "Invalid email or password.", });
            return;
        }

        if(result && result.code == HandleCode.ACCOUNT_BANNED) {
            res.status(401).json({ message: 
                "Your account has been banned. Please send email to our website for support.", });
            return;
        }

        const token = generateToken(result.userInfo.userId);
        res.status(200).json({ token: token, userInfo: result.userInfo });

    } catch (err) {
        console.log('Failed to login account:', err);
        res.status(500).json({ message: 'Failed to login account. Please try again later.' });
    }
}

module.exports = new AuthController;