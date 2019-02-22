/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {validate, omit} = require('./utils');

// GET /accounts/:accountId/orders[/:id]
exports.orders = function(req) {
  if (req == null) { req = {}; }
  const {id} = req;
  const route = (() => { switch (false) {
    case (id == null): return `accounts/${this.options.accountId}/orders/${id}`;
    default: return `accounts/${this.options.accountId}/orders`;
  } })();

  return this.request(req, route);
};

// POST /accounts/:accountId/orders
exports.orders.create = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['order']);

  return this('post').request({body: req}, `accounts/${this.options.accountId}/orders`);
};

// PUT /accounts/:accountId/orders/:id
exports.orders.replace = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id', 'order']);

  return this('put').request({body: omit(req, 'id')}, `accounts/${this.options.accountId}/orders/${req.id}`);
};

// PUT /accounts/:accountId/orders/:id/cancel
exports.orders.cancel = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id']);

  return this('put').request({body: omit(req, 'id')}, `accounts/${this.options.accountId}/orders/${req.id}/cancel`);
};

// PUT /accounts/:accountId/orders/:id/clientExtensions
exports.orders.clientExtensions = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id']);

  return this('put').request({body: omit(req, 'id')}, `accounts/${this.options.accountId}/orders/${req.id}/clientExtensions`);
};
