/* eslint-disable no-console */

const { iff,  } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    /**
     * the app will create a 'resetPwdShort' action.
     *  This action requires a password.
     * We're not using passwords, so we provide an empty string
     * to bypass the error caused by not having a password.
     */
    create: [

      iff(hook=>hook.data.action==='resetPwdShort',async(hook)=>{

        hook.data.value.password='';
        return hook;
      })
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    /**
     * again for the 'resetPwdShort' action,
     * use the authentication service to get an access token
     * and attach it to the result so it get's sent to the user.
     */
    create: [
      (hook)=>{
        console.log(hook.data);
        return hook;
      },

    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      (hook)=>{
        console.log('My Error: ',hook.error.message);
      }
    ],
    update: [],
    patch: [],
    remove: []
  }
};
