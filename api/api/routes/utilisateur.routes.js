

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
  
    var router = require("express").Router();
  
    // Récupérer tous les utilisateurs
    router.get("/", utilisateur.getAll);
    
    // Récupérer un utilisateur par ID
    router.get("/:id", utilisateur.getById);
    
    // Créer un nouvel utilisateur
    router.post("/", utilisateur.create);
    
    // Mettre à jour un utilisateur
    router.put("/:id", utilisateur.update);
    
    // Supprimer un utilisateur
    router.delete("/:id", utilisateur.delete);

    // Login utilisateur
    router.post("/login", utilisateur.login);
  
    app.use('/api/utilisateur', router);
  };
