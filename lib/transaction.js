/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {validate} = require('./utils');

// GET /accounts/:accountId/transactions[/:id]
exports.transactions = function(req) {
  if (req == null) { req = {}; }
  const {id} = req;
  const route = (() => { switch (false) {
    case (id == null): return `accounts/${this.options.accountId}/transactions/${id}`;
    default: return `accounts/${this.options.accountId}/transactions`;
  } })();

  return this.request(req, route);
};

// TODO: Consider the idrange, sinceid routes.

// GET /accounts/:accountId/transactions/stream
exports.transactions.stream = function(req) {
  if (req == null) { req = {}; }
  return this.subscribe(req, `accounts/${this.options.accountId}/transactions/stream`);
};
