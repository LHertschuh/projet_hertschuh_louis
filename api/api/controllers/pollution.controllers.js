const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {
  Pollution.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });
};

exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.Titre || !req.body.TypePollution || !req.body.Description || 
      !req.body.DateObservation || !req.body.Lieu || 
      !req.body.Latitude || !req.body.Longitude) {
    res.status(400).send({
      message: "Tous les champs obligatoires doivent être remplis!"
    });
    return;
  }

  // Créer une pollution
  const pollution = {
    IdUtilisateur: req.body.IdUtilisateur || null,
    Titre: req.body.Titre,
    TypePollution: req.body.TypePollution,
    Description: req.body.Description,
    DateObservation: req.body.DateObservation,
    Lieu: req.body.Lieu,
    Latitude: req.body.Latitude,
    Longitude: req.body.Longitude,
    PhotoUrl: req.body.PhotoUrl || null,
    CreeLe: new Date(),
    MisAJourLe: new Date()
  };

  // Sauvegarder la pollution dans la base de données
  Pollution.create(pollution)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création de la pollution."
      });
    });
};

exports.getById = (req, res) => {
  const id = req.params.id;

  Pollution.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Pollution avec l'id=${id} non trouvée.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération de la pollution avec l'id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  // Valider la requête
  if (!req.body.Titre && !req.body.TypePollution && !req.body.Description) {
    res.status(400).send({
      message: "Au moins un champ à modifier est requis!"
    });
    return;
  }

  // Ajouter la date de mise à jour
  const updateData = {
    ...req.body,
    MisAJourLe: new Date()
  };

  // Mettre à jour la pollution
  Pollution.update(updateData, {
    where: { IdPollution: id }
  })
    .then(num => {
      if (num == 1) {
        // Récupérer la pollution mise à jour pour la retourner
        Pollution.findByPk(id)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message: "Erreur lors de la récupération de la pollution mise à jour"
            });
          });
      } else {
        res.status(404).send({
          message: `Impossible de mettre à jour la pollution avec l'id=${id}. Pollution non trouvée!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la mise à jour de la pollution avec l'id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Pollution.destroy({
    where: { IdPollution: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Pollution supprimée avec succès!"
        });
      } else {
        res.status(404).send({
          message: `Impossible de supprimer la pollution avec l'id=${id}. Pollution non trouvée!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la suppression de la pollution avec l'id=" + id
      });
    });
};

exports.getByUserId = (req, res) => {
  const userId = req.params.userId;

  Pollution.findAll({
    where: { IdUtilisateur: userId },
    order: [['CreeLe', 'DESC']]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération des pollutions de l'utilisateur"
      });
    });
};