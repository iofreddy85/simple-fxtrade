/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
exports.validate = function(req, required) {
  const keys = Object.keys(req);

  const invalid = (Array.from(required).filter((param) => !Array.from(keys).includes(param)));

  if (invalid.length > 0) { throw new Error(`Required parameters missing: ${invalid.join(', ')}`); }
};

exports.assign = require('lodash/assign');

exports.omit = function(object, key) {
  const result = exports.assign({}, object);
  delete result[key];
  return result;
};
