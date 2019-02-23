/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {expect} = require('chai');
const td = require('testdouble');
const { contains } = td.matchers;

let SimpleFx = {};
let fx = {};
let axios = {};

const id = '101-001-8979098-001';

describe('positions', function() {
  before(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../../index');
    fx = new SimpleFx();
    fx.setAccount(id);
  });

  describe('GET /accounts/:accountId/[positions[/:id]|openPositions]', function() {
    it('should pass the parameters to get the positions for an account', function() {
      fx.positions();

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/positions`,
        method: 'GET'
      })
      )
      );
    });

    it('should pass the parameters to get a position by id for an account', function() {
      fx.positions({id: 'AUD_USD'});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/positions/AUD_USD`,
        method: 'GET'
      })
      )
      );
    });

    it('should pass the parameters to get open positions for an account', function() {
      fx.positions({open: true});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/openPositions`,
        method: 'GET'
      })
      )
      );
    });

    it('should pass the parameters to get the positions for an account per normal', function() {
      fx.positions({open: false});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/positions`,
        method: 'GET'
      })
      )
      );
    });
  });

  describe('PUT /accounts/:accountId/positions/:id', function() {
    it('should throw an error if missing required params', () => expect(() => fx.positions.close()).to.throw('Required parameters missing: id'));

    it('should pass the parameters to close position by instrument id', function() {
      fx.positions.close({id: 'AUD_USD'});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/positions/AUD_USD/close`,
        method: 'PUT'
      })
      )
      );
    });
  });
});
