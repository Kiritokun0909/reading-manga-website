// src/app/services/AuthService.js
const db = require('../../configs/DatabaseConfig.js');
const bcrypt = require('bcrypt');

const LOGIN_SUCCESS = 1003;
const LOGIN_FAILED = 1004;

module.exports = { 
    LOGIN_SUCCESS_CODE: LOGIN_SUCCESS,
    LOGIN_FAILED_CODE: LOGIN_FAILED,
};

module.exports.login = async (email, password) => {
    try {
        const [rows] = await db.query(
            `SELECT UserId, Username, Password, Avatar, IsBanned, Coins, RoleId FROM users WHERE Email = ?`
            , [email]
        );

        if (rows.length === 0) {
            return { code: LOGIN_FAILED, message: 'Invalid email or password.' };
        }

        const userId = rows[0].UserId;
        const username = rows[0].Username;
        const storedPassword = rows[0].Password;
        const avatar = rows[0].Avatar;
        const IsBanned = rows[0].IsBanned;
        const coins = rows[0].Coins;
        const roleId = rows[0].RoleId;

        // const isMatch = await bcrypt.compare(password, storedPassword);
        const isMatch = password === storedPassword;
        if(IsBanned == 1) {
            return { 
                code: LOGIN_FAILED, 
                message: 'Your account has been banned. Please send email to our website for support.' 
            };
        }

        if (isMatch) {
            return { 
                code: LOGIN_SUCCESS, 
                message: 'Login successfully.', 
                userId: userId,
                username: username,
                avatar: avatar,
                coins: coins,
                roleId: roleId 
            };
        } else {
            return { 
                code: LOGIN_FAILED, 
                message: 'Invalid email or password. Please try again.' 
            };
        }

    } catch (err) {
        throw err;
    }
}