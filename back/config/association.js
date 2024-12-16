// associations.js (or any other name you prefer)

const { Sequelize } = require('sequelize');




module.exports = (sequelize, models) => {
  // Define associations here
  models.account.belongsTo(models.plans, { foreignKey: 'planid', as: 'plan' });
  models.account.belongsTo(models.user, { foreignKey: 'userid', as: 'user' });
};
