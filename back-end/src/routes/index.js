const siteRouter = require('./site.js');

function route(app) {
    app.use('/site', siteRouter);
}

module.exports = route;
