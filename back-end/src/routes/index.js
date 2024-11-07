const siteRouter = require("./site.js");
const authRouter = require("./auth.js");
const adminRoute = require("./admin.js");
const accountRoute = require("./account.js");
const genreRoute = require("./genre.js");
const authorRoute = require("./author.js");
const mangaRoute = require("./manga.js");

const authService = require("../app/services/AuthService.js");
const { verifyAccessToken, authorizeRole } = require("../middlewares/jwt.js");

function route(app) {
  app.use(
    "/account",
    verifyAccessToken,
    authorizeRole([authService.RoleEnum.USER, authService.RoleEnum.ADMIN]),
    accountRoute
  );
  app.use(
    "/admin",
    verifyAccessToken,
    authorizeRole([authService.RoleEnum.ADMIN]),
    adminRoute
  );
  app.use("/manga", mangaRoute);
  app.use("/author", authorRoute);
  app.use("/genre", genreRoute);
  app.use("/auth", authRouter);
  app.use("/site", siteRouter);
}

module.exports = route;
