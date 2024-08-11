const routes = require("../routes");

const modules = (app, express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", routes);
};

module.exports = modules;
