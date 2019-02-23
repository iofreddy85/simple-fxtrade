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

describe('accounts', function() {
  before(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../../index');
    fx = new SimpleFx();
  });

  describe('GET /accounts[/:id]', function() {
    it('should pass the parameters got get the accounts', function() {
      fx.accounts();

      td.verify(axios(contains({
        url: 'https://api-fxpractice.oanda.com/v3/accounts',
        method: 'GET'
      })
      )
      );
    });

    it('should pass the parameters to get an account by id', function() {
      fx.accounts({id});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}`,
        method: 'GET'
      })
      )
      );
    });
  });

  describe('PATCH /accounts/:id', () =>
    it('should pass the parameters for patching by id', function() {
      fx('patch').accounts({id, alias: 'Default'});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/configuration`,
        method: 'PATCH',
        data: { alias: 'Default'
      }
      })
      )
      );
    })
  );

  describe('GET /accounts/:id/summary', () =>
    it('should pass the parameters to get the account summary', function() {
      fx.setAccount(id);
      fx.summary();

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/summary`,
        method: 'GET'
      })
      )
      );
    })
  );

  describe('GET /accounts/:id/instruments', () =>
    it('should pass the parameters to get the account instruments', function() {
      fx.setAccount(id);
      fx.instruments();

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/instruments`,
        method: 'GET'
      })
      )
      );
    })
  );

  describe('GET /accounts/:id/changes', function() {
    it('should throw an error if missing required params', function() {
      fx.setAccount(id);
      expect(() => fx.changes()).to.throw(
        'Required parameters missing: sinceTransactionID'
      );
    });

    it('should pass the parameters to get the account changes', function() {
      fx.setAccount(id);
      fx.changes({sinceTransactionID: 20});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/changes`,
        method: 'GET',
        params: { sinceTransactionID: 20
      }
      })
      )
      );
    });
  });
});
