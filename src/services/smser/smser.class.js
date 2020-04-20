/* eslint-disable no-unused-vars */
const client = require('twilio');

exports.Smser = class Smser {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    const { twilio: { accountSid, authToken, from } } = this.options;
    const { to, message } = data;
    await client(accountSid, authToken).messages.create({
      body: message,
      from,
      to,
    });
    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
