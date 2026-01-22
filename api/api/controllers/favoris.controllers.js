const db = require("../models");
const Favoris = db.favoris;
const Pollution = db.pollution;

// Ajouter une pollution aux favoris
exports.add = (req, res) => {
  const userId = req.user.id; // Depuis le middleware verifyToken (req.user contient les infos du token JWT)
  const pollutionId = req.params.pollutionId;

  // Vérifier si déjà en favoris
  Favoris.findOne({
    where: {
      IdUtilisateur: userId,
      IdPollution: pollutionId
    }
  })
    .then(existing => {
      if (existing) {
        return res.status(400).send({
          message: "Cette pollution est déjà dans vos favoris"
        });
      }

      // Ajouter aux favoris
      const favoris = {
        IdUtilisateur: userId,
        IdPollution: pollutionId,
        CreeLe: new Date()
      };

      Favoris.create(favoris)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Erreur lors de l'ajout aux favoris"
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la vérification des favoris"
      });
    });
};

// Retirer une pollution des favoris
exports.remove = (req, res) => {
  const userId = req.user.id;
  const pollutionId = req.params.pollutionId;

  Favoris.destroy({
    where: {
      IdUtilisateur: userId,
      IdPollution: pollutionId
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pollution retirée des favoris avec succès"
        });
      } else {
        res.status(404).send({
          message: "Favoris non trouvé"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la suppression du favoris"
      });
    });
};

// Récupérer tous les favoris d'un utilisateur
exports.getByUser = (req, res) => {
  const userId = req.user.id;

  Favoris.findAll({
    where: { IdUtilisateur: userId },
    include: [{
      model: Pollution,
      as: 'pollution'
    }],
    order: [['CreeLe', 'DESC']]
  })
    .then(data => {
      // Retourner uniquement les pollutions
      const pollutions = data.map(fav => fav.pollution);
      res.send(pollutions);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération des favoris"
      });
    });
};

// Vérifier si une pollution est en favoris
exports.check = (req, res) => {
  const userId = req.user.id;
  const pollutionId = req.params.pollutionId;

  Favoris.findOne({
    where: {
      IdUtilisateur: userId,
      IdPollution: pollutionId
    }
  })
    .then(data => {
      res.send({ isFavorite: !!data });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la vérification"
      });
    });
};
