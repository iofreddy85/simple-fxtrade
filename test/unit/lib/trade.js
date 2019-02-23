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

describe('trades', function() {
  before(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../../index');
    fx = new SimpleFx();
    fx.setAccount(id);
  });

  describe('GET /accounts/:accountId/trades[/:id]', function() {
    it('should pass the parameters to get the trades for an account', function() {
      fx.trades({count: 10, instrument: 'AUD_USD'});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/trades`,
        method: 'GET',
        params: { count: 10, instrument: 'AUD_USD'
      }
      })
      )
      );
    });

    it('should set the state filter to open', function() {
      fx.trades({open: true});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/trades`,
        method: 'GET',
        params: { state: 'OPEN'
      }
      })
      )
      );
    });

    it('should not change the state filter', function() {
      fx.trades({open: false, state: 'CLOSED'}); // pointless but testable

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/trades`,
        method: 'GET',
        params: { state: 'CLOSED'
      }
      })
      )
      );
    });

    it('should pass the parameters to get a trade by id for an account', function() {
      fx.trades({id: 123});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/trades/123`,
        method: 'GET'
      })
      )
      );
    });
  });

  describe('PUT /accounts/:accountId/trades/:id/close', () =>
    it('should pass the parameters to close a trade by id', function() {
      fx.trades.close({id: 123});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/trades/123/close`,
        method: 'PUT'
      })
      )
      );
    })
  );

  describe('PUT /accounts/:accountId/trades/:id/clientExtensions', () =>
    it('should pass the parameters to set the client extensions for a trade', function() {
      const clientExtensions = {id: 'ABC123', tag: 'MEGA1', comment: 'awesome dood'};
      fx.trades.clientExtensions({id: 123, clientExtensions});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/trades/123/clientExtensions`,
        method: 'PUT',
        data: {clientExtensions}})));
  })
);

  describe('PUT /accounts/:accountId/trades/:id/orders', () =>
    // TODO: Not putting much into this test, looks like an 'interesting' route...
    it('should pass the parameters to mess with the trades dependent orders', function() {
      const takeProfit = {timeInForce: 'GTC', price: '1.6000', type: 'TAKE_PROFIT'};

      fx.trades.orders({id: 123, takeProfit});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/trades/123/orders`,
        method: 'PUT',
        data: {takeProfit}})));
  })
);
});
