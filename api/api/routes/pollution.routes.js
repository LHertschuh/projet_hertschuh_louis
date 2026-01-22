

module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
    const verifyToken = require("../middlewares/auth.middleware.js");
  
    var router = require("express").Router();
  
    // Routes publiques
    router.get("/", pollution.get);
    
    // Routes protégées (nécessitent un token JWT)
    router.get("/user/:userId", verifyToken, pollution.getByUserId);
    router.post("/", verifyToken, pollution.create);
    router.put("/:id", verifyToken, pollution.update);
    router.delete("/:id", verifyToken, pollution.delete);
    
    // Route publique (doit être après /user/:userId pour éviter les conflits)
    router.get("/:id", pollution.getById);
  
    app.use('/api/pollution', router);
  };
