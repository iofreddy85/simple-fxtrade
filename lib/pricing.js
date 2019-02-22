/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {validate} = require('./utils');

// GET /accounts/:id/pricing
exports.pricing = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['instruments']);

  return this.request(req, `accounts/${this.options.accountId}/pricing`);
};

// GET /accounts/:id/pricing/stream
exports.pricing.stream = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['instruments']);

  return this.subscribe(req, `accounts/${this.options.accountId}/pricing/stream`);
};
