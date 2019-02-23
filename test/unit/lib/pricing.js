/*
 * decaffeinate suggestions:
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {expect} = require('chai');
const td = require('testdouble');
const { contains } = td.matchers;

let SimpleFx = {};
let fx = {};
let axios = {};

const id = '101-001-8979098-001';

describe('pricing', function() {
  before(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../../index');
    fx = new SimpleFx();
    fx.setAccount(id);
  });

  describe('GET /accounts/:id/pricing', function() {
    it('should throw an error if missing required params', () => expect(() => fx.pricing()).to.throw('Required parameters missing: instruments'));

    it('should pass the parameters to get the pricing for a list of instruments', function() {
      fx.pricing({instruments: 'AUD_USD'});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/pricing`,
        method: 'GET',
        params: { instruments: 'AUD_USD'
      }
      })
      )
      );
    });
  });
});
