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

describe('orders', function() {
  before(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../../index');
    fx = new SimpleFx();
    fx.setAccount(id);
  });

  describe('POST /accounts/:accountId/orders', function() {
    it('should throw an error if missing required params', () => expect(() => fx.orders.create()).to.throw('Required parameters missing: order'));

    it('should pass the parameters to create an order', function() {
      const order = {
        units: 1,
        instrument: 'AUD_USD',
        timeInForce: 'FOK',
        type: 'MARKET',
        positionFill: 'DEFAULT',
        tradeId: 6368
      };

      fx.orders.create({order});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/orders`,
        method: 'POST',
        data: {order}})));
  });
});

  describe('GET /accounts/:accountId/orders[/:id]', function() {
    it('should pass the parameters get the orders for an account', function() {
      fx.orders();

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/orders`,
        method: 'GET'
      })
      )
      );
    });

    it('should pass the parameters get an order by id for an account', function() {
      fx.orders({id: 1234});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/orders/1234`,
        method: 'GET'
      })
      )
      );
    });
  });

  describe('PUT /accounts/:accountId/orders/:id', function() {
    it('should throw an error if missing required params', () => expect(() => fx.orders.replace()).to.throw('Required parameters missing: id, order'));

    it('should pass the parameters to replace an order', function() {
      const order = {
        units: 1,
        instrument: 'AUD_USD',
        timeInForce: 'FOK',
        type: 'MARKET',
        positionFill: 'DEFAULT',
        tradeId: 6368
      };

      fx.orders.replace({id: 1234, order});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/orders/1234`,
        method: 'PUT',
        data: {order}})));
  });
});

  describe('PUT /accounts/:accountId/orders/:id/cancel', function() {
    it('should throw an error if missing required params', () => expect(() => fx.orders.cancel()).to.throw('Required parameters missing: id'));

    it('should pass the parameters to cancel an order', function() {
      fx.orders.cancel({id: 1234});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/orders/1234/cancel`,
        method: 'PUT'
      })
      )
      );
    });
  });

  describe('PUT /accounts/:accountId/orders/:id/clientExtensions', function() {
    it('should throw an error if missing required params', () => expect(() => fx.orders.clientExtensions()).to.throw('Required parameters missing: id'));

    it('should pass the parameters to modify client extensions', function() {
      const clientExtensions = {id: 'ABC123', tag: 'MEGA1', comment: 'awesome dood'};
      const tradeClientExtensions = {id: '998876', tag: 'A1', comment: 'Wowz'};

      fx.orders.clientExtensions({id: 1234, clientExtensions, tradeClientExtensions});

      td.verify(axios(contains({
        url: `https://api-fxpractice.oanda.com/v3/accounts/${id}/orders/1234/clientExtensions`,
        method: 'PUT',
        data: {clientExtensions, tradeClientExtensions}})));
  });
});
});
