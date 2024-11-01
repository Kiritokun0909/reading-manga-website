// src/routes/index.js
const siteRouter = require('./site.js');
const authRouter = require('./auth.js');
const adminRoute = require('./admin.js');
const accountRoute = require('./account.js');
const genreRoute = require('./genre.js');
const authorRoute = require('./author.js');
const mangaRoute = require('./manga.js');

const userService = require('../app/services/UserService.js');
const { verifyToken, authorizeRole } =  require('../middlewares/jwtMiddleware.js');

function route(app) {
    app.use('/account', verifyToken, authorizeRole(userService.RoleEnum.USER), accountRoute);
    app.use('/admin', verifyToken, authorizeRole(userService.RoleEnum.ADMIN), adminRoute);
    app.use('/genre', genreRoute);
    app.use('/author', authorRoute);
    app.use('/manga', mangaRoute);
    app.use('/auth', authRouter);
    app.use('/site', siteRouter);
}

module.exports = route;
