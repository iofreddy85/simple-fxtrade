/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
require('dotenv').load({silent: true});
const _ = require('lodash');
const {expect} = require('chai');
const SimpleFx = require('../../index');
const fx = new SimpleFx();

const id = '101-001-8979098-001';

describe('--- Integration Tests ---', function() {
  describe('accounts', function() {
    describe('GET /accounts[/:id]', function() {
      it('should get the accounts', async function() {
        const {accounts} = await fx.accounts();

        expect(_.size(accounts)).to.be.above(0);
      });

      it('should return the account by id', async function() {
        const {account} = await fx.accounts({id});

        expect(account.id).to.be.equal(id);
        expect(account.alias).to.be.equal('Primary');
      });
    });

    describe('PATCH /accounts/:id', () =>
      it('should configure the account', async function() {
        const {clientConfigureTransaction: {alias}} = await fx('patch').accounts({id, alias: 'Default'});
        expect(alias).to.be.equal('Default');

        // Change back to Primary
        fx('patch').accounts({id, alias: 'Primary'});
    })
  );

    describe('GET /accounts/:id/summary', () =>
      it('should return the account summary', async function() {
        fx.setAccount(id);
        const {account} = await fx.summary();

        expect(account.id).to.be.equal(id);
      })
    );

    describe('GET /accounts/:id/instruments', () =>
      it('should return the account instruments', async function() {
        fx.setAccount(id);
        const {instruments} = await fx.instruments();
        const pair = _.first(_.filter(instruments, {name: 'AUD_USD'}));

        expect(pair.displayName).to.be.equal('AUD/USD');
      })
    );

    describe('GET /accounts/:id/changes', () =>
      it('should return the account changes', async function() {
        fx.setAccount(id);
        const {lastTransactionID} = await fx.transactions();
        const {changes: {transactions}} = await fx.changes({sinceTransactionID: +lastTransactionID - 1});

        expect(_.isEmpty(transactions)).to.not.be.ok;
      })
    );
  });

  describe('candles', () =>
    describe('GET /instruments/:accountId/candles', () =>
      it('should return the candles for a given instrument', async function() {
        fx.setAccount(id);

        const {granularity, candles, instrument} = await fx.candles({id: 'AUD_USD'});
        expect(instrument).to.be.equal('AUD_USD');
        expect(granularity).to.be.equal('S5');
        expect(_.size(candles)).to.be.equal(500);
      })
    )
  );

  describe('pricing', function() {
    describe('GET /accounts/:id/pricing', () =>
      it('should return the pricing for an instrument', async function() {
        fx.setAccount(id);

        const obj = await fx.pricing({instruments: 'AUD_USD'}),
        [{instrument, type}] = Array.from(obj.prices);

        expect(instrument).to.be.equal('AUD_USD');
        expect(type).to.be.equal('PRICE');
      })
    );

    describe('GET /accounts/:id/pricing/stream', function() {
      it('should throw an error if missing required params', function() {
        fx.setAccount(id);
        expect(() => fx.pricing.stream()).to.throw('Required parameters missing: instruments');
      });

      it('should subscribe to the pricing stream', async function() {
        fx.setAccount(id);
        const stream = await fx.pricing.stream({instruments: 'AUD_USD'});

        new Promise(function(resolve) {
          stream.on('data', function({type}) {
            expect(type).to.match(/PRICE|HEARTBEAT/);
            stream.disconnect();
            resolve();
          });
        });
      });
    });
  });


  describe('transactions', function() {
    describe('GET /accounts/:accountId/transactions[/:id]', () =>
      it('should throw an error if missing required params', async function() {
        fx.setAccount(id);
        const {count, pageSize} = await fx.transactions();
        expect(count).to.be.above(50);
        expect(pageSize).to.be.equal(100);
      })
    );

      // it 'should return a specified transaction id', ->
      //   fx.setAccount id
      //   {transaction: {alias, type}} = await fx.transactions id: 10
      //   expect(type).to.be.equal 'CLIENT_CONFIGURE'
      //   expect(alias).to.be.equal 'Default'

    describe('GET /accounts/:accountId/transactions/stream', () =>
      it('should subscribe to the transactions stream', async function() {
        fx.setAccount(id);
        const stream = await fx.transactions.stream();
        new Promise(function(resolve) {
          stream.on('data', function({type}) {
            expect(type).to.match(/HEARTBEAT|CLIENT_CONFIGURE/);
            stream.disconnect();
            resolve();
          });
        });
      })
    );
  });

  // TODO: Need to fix up these integration tests. Problem is they depend
  // on timing and other irritating factors
  describe('trades', () =>
    describe('GET /accounts/:accountId/trades[/:id]', () =>
      // TODO: Need to return actual trades
      it('should throw an error if missing required params', async function() {
        fx.setAccount(id);

        const {trades} = await fx.trades();
        expect(trades).to.be.ok;
      })
    )
  );

  describe.skip('orders', () =>
    describe('POST /accounts/:accountId/orders', function() {
      it('should create an order', async function() {
        fx.setAccount(id);
        let result = await fx.orders.create({
          order: {
            id,
            units: 1,
            instrument: 'AUD_USD',
            timeInForce: 'FOK',
            type: 'MARKET',
            positionFill: 'DEFAULT',
            tradeId: 6368
          }
        });
      });

      it('should return the orders for an account', function() {});
    })
  );

  // TODO: Implement these integration tests if possible
  describe.skip('positions', function() {});
});
