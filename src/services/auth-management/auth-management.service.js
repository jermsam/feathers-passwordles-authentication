// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
const hooks = require('./auth-management.hooks');
const notifier = require('./notifier');

const sanitizeUserForClient= (user)=> {
  // avoid returning the user to the client when not authorized
  return { email: user.email };
};

module.exports = function (app) {
  const notifierObj=notifier(app);

  // Initialize our service with any options it requires
  app.configure(authManagement({
    notifier:notifierObj.notifier,
    // skipIsVerifiedCheck: true,
    sanitizeUserForClient,
    shortTokenLen:4,
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authManagement');

  service.hooks(hooks);
};
