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

describe('transactions', function() {
  before(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../../index');
    fx = new SimpleFx();
    fx.setAccount(id);
  });

  describe('GET /accounts/:accountId/transactions[/:id]', function() {
    it('should pass the parameters to get the transactions for an account', function() {
      fx.transactions({pageSize: 10, type: 'CLIENT_CONFIGURE'});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/transactions`,
        method: 'GET',
        params: { pageSize: 10, type: 'CLIENT_CONFIGURE'
      }
      })
      )
      );
    });

    it('should pass the parameters to get a transaction by id for an account', function() {
      fx.transactions({id: 123});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/transactions/123`,
        method: 'GET'
      })
      )
      );
    });
  });
});
