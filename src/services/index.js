const users = require('./users/users.service.js');
const mailer = require('./mailer/mailer.service.js');
const smser = require('./smser/smser.service.js');
const authManagement = require('./auth-management/auth-management.service.js');
const webhook = require('./webhook/webhook.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(mailer);
  app.configure(smser);
  app.configure(authManagement);
  app.configure(webhook);
};
