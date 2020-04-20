// Initializes the `smser` service on path `/smser`
const { Smser } = require('./smser.class');
const hooks = require('./smser.hooks');

module.exports = function (app) {
  const twilio = app.get('twilio');
  const options = {
    twilio,
  };

  // Initialize our service with any options it requires
  app.use('/smser', new Smser(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('smser');

  service.hooks(hooks);
};
