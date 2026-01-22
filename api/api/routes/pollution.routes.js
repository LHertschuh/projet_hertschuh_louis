

module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
    const verifyToken = require("../middlewares/auth.middleware.js");
  
    var router = require("express").Router();
  
    // Routes publiques
    router.get("/", pollution.get);
    router.get("/:id", pollution.getById);
    
    // Routes protégées (nécessitent un token JWT)
    router.post("/", verifyToken, pollution.create);
    router.put("/:id", verifyToken, pollution.update);
    router.delete("/:id", verifyToken, pollution.delete);
  
    app.use('/api/pollution', router);
  };
