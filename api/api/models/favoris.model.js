module.exports = (sequelize, Sequelize) => {
  const Favoris = sequelize.define("Favoris", {
    IdFavoris: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    IdUtilisateur: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateur',
        key: 'IdUtilisateur'
      }
    },
    IdPollution: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Pollution',
        key: 'IdPollution'
      }
    },
    CreeLe: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'Favoris',
    timestamps: false
  });

  return Favoris;
};
