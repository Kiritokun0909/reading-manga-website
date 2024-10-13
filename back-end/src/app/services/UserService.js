// src/app/services/UserService.js
const db = require('../../configs/DatabaseConfig.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const RoleEnum = {
    ADMIN: 1,
    USER: 2,
};

const EMAIL_EXIST = 1000;
const REGISTER_SUCCESS = 1001;
const REGISTER_FAILED = 1002;

module.exports = { 
    RoleEnum,
    EMAIL_EXIST_CODE: EMAIL_EXIST,
    REGISTER_SUCCESS_CODE: REGISTER_SUCCESS,
    REGISTER_FAILED_CODE: REGISTER_FAILED,
};

module.exports.register = async (username = "user", email, password, role) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [] = await db.query(`
            INSERT INTO users (
                \`Username\`,
                \`Email\`,
                \`Password\`,
                \`RoleID\`
            ) VALUES (?, ?, ?, ?)
        `, [username, email, hashedPassword, role]);

        return { code: REGISTER_SUCCESS, message: 'Register account successfully.' };;
    }
    catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return { code: EMAIL_EXIST, message: 'Email is already existed. Try another email.' };
        }
        
        throw err;
    }
}
