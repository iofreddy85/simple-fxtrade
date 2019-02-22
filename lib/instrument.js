/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {validate} = require('./utils');

// GET /instruments/:accountId/candles
exports.candles = function(req) {
  if (req == null) { req = {}; }
  validate(req, ['id']);

  return this.request(req, `instruments/${req.id}/candles`, false);
};
