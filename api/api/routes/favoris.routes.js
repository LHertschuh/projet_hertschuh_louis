module.exports = app => {
  const favoris = require("../controllers/favoris.controllers.js");
  const verifyToken = require("../middlewares/auth.middleware.js");

  var router = require("express").Router();

  // Toutes les routes nécessitent une authentification
  router.get("/", verifyToken, favoris.getByUser);
  router.post("/:pollutionId", verifyToken, favoris.add);
  router.delete("/:pollutionId", verifyToken, favoris.remove);
  router.get("/check/:pollutionId", verifyToken, favoris.check);

  app.use('/api/favoris', router);
};
