/*
 * decaffeinate suggestions:
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {expect} = require('chai');
const {validate} = require('../../../lib/utils');

describe('utils', () =>
  describe('#validate', function() {
    it('should throw an error if request is missing required params', () =>
      expect(() => validate({id: 123}, ['id', 'other'])).to.throw(
        'Required parameters missing: other'
      )
    );

    it('should return if all valid parameters provided', () => validate({id: 123, since: '2017-01-01'}, ['id', 'since']));
})
);
