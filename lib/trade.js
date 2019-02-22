/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {omit, validate} = require('./utils');

// GET /accounts/:accountId/trades[/:id]
exports.trades = function(req) {
  if (req == null) { req = {}; }
  const {id, open} = req;

  if (open) { req.state = 'OPEN'; }

  const route = (() => { switch (false) {
    case (id == null): return `accounts/${this.options.accountId}/trades/${id}`;
    default: return `accounts/${this.options.accountId}/trades`;
  } })();

  return this.request(req, route);
};

// PUT /accounts/:accountId/trades/:id/close
exports.trades.close = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id']);

  return this('put').request({body: omit(req, 'id')}, `accounts/${this.options.accountId}/trades/${req.id}/close`);
};

// PUT /accounts/:accountId/trades/:id/clientExtensions
exports.trades.clientExtensions = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id']);

  return this('put').request({body: omit(req, 'id')}, `accounts/${this.options.accountId}/trades/${req.id}/clientExtensions`);
};

// PUT /accounts/:accountId/trades/:id/orders
exports.trades.orders = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id']);

  return this('put').request({body: omit(req, 'id')}, `accounts/${this.options.accountId}/trades/${req.id}/orders`);
};
