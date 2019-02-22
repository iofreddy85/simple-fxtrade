/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {validate, omit} = require('./utils');

// GET | PATCH /accounts[/:id]
exports.accounts = function(req) {
  if (req == null) { req = {}; }
  const {id} = req;

  if (this.method === 'PATCH') {
    validate(req, ['id']);

    return this.request({body: omit(req, 'id')}, `accounts/${id}/configuration`, false);
  }

  const route = (() => { switch (false) {
    case (id == null): return `accounts/${id}`;
    default: return 'accounts';
  } })();

  return this.request(req, route, false);
};

// GET /accounts/:accountId/summary
exports.summary = function(req) {
  if (req == null) { req = {}; }
  return this.request(req, `accounts/${this.options.accountId}/summary`);
};

// GET /accounts/:accountId/instruments
exports.instruments = function(req) {
  if (req == null) { req = {}; }
  return this.request(req, `accounts/${this.options.accountId}/instruments`);
};

// GET /accounts/:accountId/changes
exports.changes = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['sinceTransactionID']);

  return this.request(req, `accounts/${this.options.accountId}/changes`);
};
