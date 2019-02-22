/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {omit, validate} = require('./utils');

// GET /accounts/:accountId/[positions[/:id]|openPositions]
exports.positions = function(req) {
  if (req == null) { req = {}; }
  const {id, open} = req;
  const route = (() => { switch (false) {
    case (id == null): return `accounts/${this.options.accountId}/positions/${id}`;
    case !open: return `accounts/${this.options.accountId}/openPositions`;
    default: return `accounts/${this.options.accountId}/positions`;
  } })();

  return this.request(req, route);
};

// PUT /accounts/:accountId/positions/:id/close
exports.positions.close = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id']);

  return this('put').request({body: omit(req, 'id')}, `accounts/${this.options.accountId}/positions/${req.id}/close`);
};
