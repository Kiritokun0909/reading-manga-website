// src/routes/index.js
const siteRouter = require('./site.js');
const authRouter = require('./auth.js');
const adminRoute = require('./admin.js');

const userService = require('../app/services/UserService.js');
const { verifyToken, authorizeRole } =  require('../middlewares/jwtMiddleware.js');

function route(app) {
    app.use('/admin', adminRoute);
    app.use('/auth', authRouter);
    app.use('/site', siteRouter);
}

module.exports = route;
