/*
 * decaffeinate suggestions:
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {EventEmitter} = require('events');
const {expect} = require('chai');
const td = require('testdouble');
const Subscription = require('../../../lib/subscription');

class MockEmitter extends EventEmitter {
  constructor() {
    super();
    this.req = {abort: () => this.emit('end', 'its done!')};
  }
}

describe('Subscription', function() {
  let emitter = null;

  beforeEach(() => emitter = new MockEmitter);

  describe('#constructor', function() {
    it('should construct a new Subscription', function() {
      const sub = new Subscription;

      expect(sub).to.be.instanceof(EventEmitter);
      expect(sub).to.be.instanceof(Subscription);
    });

    it('should construct a new Subscription with a given stream and options', function() {
      const sub = new Subscription(emitter, {json: true});

      expect(sub.stream).to.be.ok;
      expect(sub.options.json).to.be.ok;
    });
  });


  describe('#on error', () =>
    it('should pass through and emit on error', function(done) {
      const sub = new Subscription(emitter);
      sub.on('error', function(message) {
        expect(message).to.be.equal('Stuff failed');
        done();
      });

      emitter.emit('error', 'Stuff failed');
    })
  );

  describe('#on data', function() {
    it('should pass through and convert the json', function(done) {
      const sub = new Subscription(emitter, {json: true});
      sub.on('data', function(data) {
        expect(data).to.be.eql({stuff: 'worked'});
        expect(sub.connected).to.be.ok;
        done();
      });

      emitter.emit('data', '{"stuff":"worked"}');
    });

    it('should not explode if the data is empty and no event should be emitted', function(done) {
      const sub = new Subscription(emitter, {json: true});
      const handler = td.func();
      sub.on('data', handler);
      sub.on('end', function() {
        expect(td.explain(handler).callCount).to.equal(0);
        done();
      });

      emitter.emit('data', Buffer.from(''));
      sub.disconnect();
    });

    it('should handle messages with multiple JSON entries in the buffer and empty whitespacing', function(done) {
      const sub = new Subscription(emitter, {json: true});
      const handler = td.func();
      sub.on('data', handler);
      sub.on('end', function() {
        expect(td.explain(handler).callCount).to.equal(2);
        td.verify(handler({stuff: 'worked'}));
        td.verify(handler({another: 'random message'}));
        done();
      });

      emitter.emit('data', `\r\n \
{"stuff":"worked"}\n \
{"another": "random message"}\
`
      );
      sub.disconnect();
    });

    it('should emit an error when json data is not parsed successfully', function(done) {
      const sub = new Subscription(emitter, {json: true});
      const dataHandler = td.func();
      const errorHandler = td.func();
      sub.on('data', dataHandler);
      sub.on('error', errorHandler);
      sub.on('end', function() {
        expect(td.explain(dataHandler).callCount).to.equal(0);
        expect(td.explain(errorHandler).callCount).to.equal(1);
        expect(td.explain(errorHandler).calls[0].args[0].message).to.match(/Subscription error parsing Oanda response/);
        done();
      });

      emitter.emit('data', '}{}\n}invalid json');
      sub.disconnect();
    });
  });


  describe('#on end / disconnect', () =>
    it('should disconnect the subscription', function(done) {
      const sub = new Subscription(emitter, {json: true});
      sub.on('end', function(data) {
        expect(data).to.be.equal('its done!');
        expect(sub.connected).to.not.be.ok;
        done();
      });
      sub.disconnect();
    })
  );
});
