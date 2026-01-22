module.exports = (sequelize, Sequelize) => {
  const Utilisateur = sequelize.define("Utilisateur", {
    IdUtilisateur: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },  
    Nom: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    Email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true
    },    
    MotDePasse: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    CreeLe: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'Utilisateur',
    timestamps: false
  });
  
  return Utilisateur;
};