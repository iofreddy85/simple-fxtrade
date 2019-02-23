/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
require('dotenv').load({silent: true});
const _ = require('lodash');
const {expect} = require('chai');
const td = require('testdouble');
const { contains } = td.matchers;

let SimpleFx = {};
let fx = {};
let axios = {};

const disableMocks = function() {
  td.reset();
  SimpleFx = require('../../index');
  fx = new SimpleFx();
};

afterEach(() => td.reset());

describe('--- Unit Tests ---', function() {

  beforeEach(function() {
    axios = td.replace('axios');
    SimpleFx = require('../../index');
    fx = new SimpleFx();
  });


  describe('main package', function() {
    describe('module exports', function() {
      it('should export correctly', () => expect(fx).to.be.ok);

      it('should be a function', () => expect(_.isFunction(fx)).to.be.ok);

      it('should setup the correct defaults', () =>
        expect(fx.options).to.be.eql({
          apiKey: process.env.OANDA_API_KEY,
          live: false,
          version: 'v3',
          dateTimeFormat: 'RFC3339',
          throwHttpErrors: true
        })
      );
    });

    describe('#fx', () =>
      it('should allow the caller to temporarily set the http method', function() {
        const temp = fx('post');
        expect(temp.method).to.be.equal('POST');
        expect(temp.options).to.be.eql({
          apiKey: process.env.OANDA_API_KEY,
          live: false,
          version: 'v3',
          dateTimeFormat: 'RFC3339',
          throwHttpErrors: true
        });
      })
    );

    describe('#setAccount', () =>
      it('should set the accountId', function() {
        expect(fx.options.accountId).to.not.be.ok;
        fx.setAccount('12345');
        expect(fx.options.accountId).to.be.equal('12345');
      })
    );

    describe('#setDateTimeFormat', function() {
      it('should set the date time format', function() {
        expect(fx.options.dateTimeFormat).to.be.equal('RFC3339');
        fx.setDateTimeFormat('UNIX');
        expect(fx.options.dateTimeFormat).to.be.equal('UNIX');
      });

      it('should throw an error when given an invalid format', () => expect(() => fx.setDateTimeFormat('INVALIDTHING')).to.throw('invalid date time format'));
    });

    describe('#configure', () =>
      it('should set the api options', function() {
        const temp = fx('get');
        const options = {
          accountId: 234,
          live: true,
          version: 'v1',
          apiKey: '12',
          dateTimeFormat: 'RFC3339',
          throwHttpErrors: false
        };

        temp.configure(options);
        expect(temp.options).to.be.eql(options);
      })
    );

    describe('#endpoint', function() {
      it('should return the practice api endpoint when not live', () => expect(fx.endpoint()).to.be.equal('https://api-fxpractice.oanda.com/v3/'));

      it('should return the trade api endpoint when live', function() {
        const temp = fx('get');
        temp.configure({live: true});
        expect(temp.endpoint()).to.be.equal('https://api-fxtrade.oanda.com/v3/');
      });

      it('should return the practice stream endpoint when not live', () => expect(fx.endpoint('', 'stream')).to.be.equal('https://stream-fxpractice.oanda.com/v3/'));

      it('should return the trade api endpoint when live', function() {
        const temp = fx('get');
        temp.configure({live: true});
        expect(temp.endpoint('', 'stream')).to.be.equal('https://stream-fxtrade.oanda.com/v3/');
      });

      it('should concatenate the route to the url', () => expect(fx.endpoint('accounts/123')).to.be.equal('https://api-fxpractice.oanda.com/v3/accounts/123'));

      it('should throw an error when given an invalid mode', () => expect(() => fx.endpoint('accounts/123', 'invalid')).to.throw('invalid mode'));
    });

    describe('#request', function() {
      it('should call request-promise respecting the provided url', async function() {
        fx.setAccount('1');
        await fx.request({url: 'https://www.google.com'});
        td.verify(axios(contains({url: 'https://www.google.com'})));
      });

      it('should reject as an error when there is no apiKey set', function() {
        const temp = fx('get');
        temp.configure({apiKey: undefined});

        try {
          temp.request('accounts');
          expect.fail();
        } catch (error) {
          const {message} = error;
          expect(message).to.match(/Api key is not set/);
        }
      });

      it('should reject as an error when validating the accountId', function() {
        const temp = fx('get');
        temp.configure({accountId: undefined});

        try {
          temp.request('accounts');
          expect.fail();
        } catch (error) {
          const {message} = error;
          expect(message).to.match(/Account id must be set for this request/);
        }
      });

      it('should use the endpoint to set the correct api url', function() {
        fx.setAccount('123');
        fx.request({}, 'accounts');
        td.verify(axios(contains({url: 'https://api-fxpractice.oanda.com/v3/accounts'})));
      });

      it('should strip body and include properties as query parms', function() {
        fx.setAccount('123');
        fx.request({body: 'This is content', since: '2017-01-01', id: 1234}, 'accounts');
        td.verify(axios(contains({
          data: 'This is content',
          params: { since: '2017-01-01'
        },
          responseType: 'json',
          url: 'https://api-fxpractice.oanda.com/v3/accounts'
        })
        )
        );
      });

      it('should always pass the authorization header', function() {
        fx.setAccount('123');
        fx.request({}, 'accounts');
        td.verify(axios(contains({
          headers: {Authorization: `Bearer ${process.env.OANDA_API_KEY}`}})
        )
        );
      });
    });

    describe('#subscribe', function() {
      // Disabled due to the new way we must subscribe
      it('should call request passing the expected options', function() {
        fx.setAccount('123');
        const subscription =  fx.subscribe({});

        td.verify(axios(contains({
          url: 'https://stream-fxpractice.oanda.com/v3/',
          headers: { Authorization: `Bearer ${process.env.OANDA_API_KEY}`
        },
          params: {},
          responseType: 'stream'
        })
        )
        );
      });

      it('should throw an error for messed up requests', async function() {
        disableMocks();
        const url = 'http://brokenurl.town';
        fx.setAccount('2');
        try {
          await fx.subscribe({url});
          expect.fail();
        } catch (err) {
          expect(err.message).to.match(/ENOTFOUND brokenurl\.town/);
        }
      });

      it('should ok without any errors', async function() {
        disableMocks();
        const url = 'https://www.google.com';
        fx.setAccount('2');
        expect(await fx.subscribe({url, json: false})).to.be.ok
      });
    });
  });
});
