const Sequelize = require('sequelize');

module.exports = function (app) {
  let sequelize;
  const {host,port,username,password,database}=app.get('postgres');

  if(process.env.DATABASE_URL){
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      protocol: 'postgres',
    });
  }else{
    sequelize = new Sequelize(database,username,password, {
      port,
      host,
      dialect: 'postgres',
      logging: false,
      define: {
        freezeTableName: true
      }
    });
  }
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync());

    return result;
  };
};
