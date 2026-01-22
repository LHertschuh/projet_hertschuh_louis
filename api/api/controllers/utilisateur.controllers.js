const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

// Clé secrète pour JWT depuis le fichier .env
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h"; // Token valide 24 heures

// Find a single Utilisateur with an Email
exports.login = async (req, res) => {
  const utilisateur = {
    email: req.body.email,
    password: req.body.password
  };

  // Test email format
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(utilisateur.email) && utilisateur.password) {
    try {
      const data = await Utilisateurs.findOne({ where: { Email: utilisateur.email } });
      
      if (data) {
        // Comparer le mot de passe hashé avec bcrypt
        const isPasswordValid = await bcrypt.compare(utilisateur.password, data.MotDePasse);
        
        if (isPasswordValid) {
          // Créer le payload du token
          const payload = {
            id: data.IdUtilisateur,
            nom: data.Nom,
            email: data.Email
          };

          // Générer le token JWT
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

          res.send({
            message: "Connexion réussie",
            user: {
              id: data.IdUtilisateur,
              nom: data.Nom,
              email: data.Email,
              creeLe: data.CreeLe
            },
            token: token
          });
        } else {
          res.status(401).send({
            message: "Mot de passe incorrect"
          });
        }
      } else {
        res.status(404).send({
          message: `Utilisateur avec l'email=${utilisateur.email} non trouvé.`
        });
      }
    } catch (err) {
      res.status(400).send({
        message: "Erreur lors de la récupération de l'utilisateur avec l'email=" + utilisateur.email
      });
    }
  } else {
    res.status(400).send({
      message: "Email ou mot de passe invalide" 
    });
  }
};

exports.getAll = (req, res) => {
  Utilisateurs.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });
};

exports.getById = (req, res) => {
  const id = req.params.id;

  Utilisateurs.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Utilisateur avec l'id=${id} non trouvé.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération de l'utilisateur avec l'id=" + id
      });
    });
};

exports.create = async (req, res) => {
  if (!req.body.Nom || !req.body.Email || !req.body.MotDePasse) {
    res.status(400).send({
      message: "Le nom, l'email et le mot de passe sont requis!"
    });
    return;
  }

  try {
    // Hasher le mot de passe avec bcrypt (10 rounds de salt)
    const hashedPassword = await bcrypt.hash(req.body.MotDePasse, 10);

    const utilisateur = {
      Nom: req.body.Nom,
      Email: req.body.Email,
      MotDePasse: hashedPassword,
      CreeLe: new Date()
    };
    console.log(utilisateur);

    const data = await Utilisateurs.create(utilisateur);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur."
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;

  if (!req.body.Nom && !req.body.Email && !req.body.MotDePasse) {
    res.status(400).send({
      message: "Au moins un champ à modifier est requis!"
    });
    return;
  }

  try {
    const updateData = { ...req.body };
    
    // Si le mot de passe est modifié, le hasher
    if (req.body.MotDePasse) {
      updateData.MotDePasse = await bcrypt.hash(req.body.MotDePasse, 10);
    }

    const num = await Utilisateurs.update(updateData, {
      where: { IdUtilisateur: id }
    });

    if (num == 1) {
      const data = await Utilisateurs.findByPk(id);
      res.send(data);
    } else {
      res.status(404).send({
        message: `Impossible de mettre à jour l'utilisateur avec l'id=${id}. Utilisateur non trouvé!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la mise à jour de l'utilisateur avec l'id=" + id
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Utilisateurs.destroy({
    where: { IdUtilisateur: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur supprimé avec succès!"
        });
      } else {
        res.status(404).send({
          message: `Impossible de supprimer l'utilisateur avec l'id=${id}. Utilisateur non trouvé!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la suppression de l'utilisateur avec l'id=" + id
      });
    });
};