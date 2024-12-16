const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paylog', {
    paymentid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    verified: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
    ,
    
    date: {
        type: DataTypes.DATE,
        allowNull: true
      }
  }, {
    sequelize,
    tableName: 'paylog',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "paymentid" },
        ]
      },
    ]
  });
};
