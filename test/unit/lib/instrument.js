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

describe('candles', function() {
  before(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../../index');
    fx = new SimpleFx();
    fx.setAccount(id);
  });

  describe('GET /instruments/:accountId/candles', function() {
    it('should throw an error if missing required params', () => expect(() => fx.candles()).to.throw('Required parameters missing: id'));

    it('should pass the parameters for getting the candles of a given instrument id', function() {
      fx.candles({id: 'AUD_USD', granularity: 'M1'});
      td.verify(axios(contains({
        url: 'https://api-fxpractice.oanda.com/v3/instruments/AUD_USD/candles',
        method: 'GET',
        params: { granularity: 'M1'
      }
      })
      )
      );
    });
  });
});
