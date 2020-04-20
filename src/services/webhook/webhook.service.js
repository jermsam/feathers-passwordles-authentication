// Initializes the `webhook` service on path `/webhook`
const { Webhook } = require('./webhook.class');
const hooks = require('./webhook.hooks');
const df=require('../../middleware');



module.exports = function async (app) {
  const options = {
    paginate: app.get('paginate')
  };




  // Initialize our service with any options it requires
  app.use('/webhook', new Webhook(options, app),df);

  // Get our initialized service so that we can register hooks
  const service = app.service('webhook');

  service.hooks(hooks);
};
