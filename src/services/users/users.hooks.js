/* eslint-disable quotes */
/* eslint-disable no-console */
const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');
const {
  when,
  discard,
  iff,
  isProvider,
  preventChanges,
} = require('feathers-hooks-common');
const {
  addVerification,
  removeVerification,
} = require('feathers-authentication-management').hooks;

const {
  protect
} = require('@feathersjs/authentication-local').hooks;

// const notifier = require('../auth-management/notifier');

const removeVerificationProperties = protect(    'verifyToken',
  'verifyShortToken',
  'verifyExpires',
  'verifyChanges',
  'resetToken',
  'resetShortToken',
  'resetExpires');

const preventVerificationPropertyChanges =
  iff(isProvider('external'), preventChanges(true,
    'isVerified',
    'verifyToken',
    'verifyShortToken',
    'verifyExpires',
    'verifyChanges',
    'resetToken',
    'resetShortToken',
    'resetExpires'
  ));

const restrict = [
  authenticate('jwt'),
  setField({
    from: 'params.user.id',
    as: 'params.query.id'
  })
];
/**
 * Add/Remove verification properties on user objects,
 * and prevent those properties from getting changed
 * by external providers (rest/socket.io)
 */
module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [
      iff(hook=>hook.params.authentication.strategy!=='passwordless',
        (hook)=>{ console.log(hook.params.authentication.strategy);},
        ...restrict
      )
    ],
    create: [
      addVerification()
    ],
    update: [
      ...restrict,
      preventVerificationPropertyChanges
    ],
    patch: [
      ...restrict,
      preventVerificationPropertyChanges
    ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('password')
      )
    ],
    find: [
      iff(isProvider('external'), hook => {
        if (Array.isArray(hook.result.data)) {
          hook.result.data.forEach(removeVerificationProperties);
        }
        return Promise.resolve(hook);
      })
    ],
    get: [
      iff(isProvider('external'), removeVerification())
    ],
    create: [
      removeVerification()
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

