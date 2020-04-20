const assert = require('assert');
const app = require('../../src/app');

describe('\'smser\' service', () => {
  it('registered the service', () => {
    const service = app.service('smser');

    assert.ok(service, 'Registered the service');
  });
});
