module.exports = (sequelize, Sequelize) => {
  const Pollution = sequelize.define("Pollution", {
    IdPollution: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    IdUtilisateur: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Utilisateur',
        key: 'IdUtilisateur'
      }
    },
    Titre: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    TypePollution: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre']]
      }
    },
    Description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    DateObservation: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    Lieu: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    Longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    PhotoUrl: {
      type: Sequelize.TEXT
    },
    CreeLe: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    MisAJourLe: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'Pollution',
    timestamps: false
  });

  return Pollution;
};