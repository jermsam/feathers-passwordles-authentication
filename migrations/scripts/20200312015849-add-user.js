'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate:{
            isEmail:{
              args:true,
              msg: 'Invalid Email'
            }
          }
        },
        isVerified: { type: Sequelize.BOOLEAN },

        verifyToken: { type: Sequelize.STRING },

        verifyShortToken: { type: Sequelize.STRING },

        verifyExpires: { type: Sequelize.DATE },
        verifyChanges: { type: Sequelize.JSON },
        resetToken: { type: Sequelize.STRING },
        resetShortToken: { type: Sequelize.STRING },
        resetExpires: { type: Sequelize.DATE },
        createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      }, {
        // options
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable('users');
  }
};
