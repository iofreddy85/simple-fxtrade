/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {EventEmitter} = require('events');
const {assign} = require('./utils');

class Subscription extends EventEmitter {
  constructor(stream, options) {
    super();
    if (stream == null) { return; }

    this.connected = false;
    this.stream = stream;
    this.options = assign({}, options);

    this.stream.on('data', data => {
      this.connected = true;

      // On some occasions OANDA will send multiple JSON messages into the stream
      // which are separated by newline. In those instances we split and parse each
      // message individually ignoring empty strings.
      try {
        const messages = (() => { switch (false) {
          case !this.options.json:
            return data
              .toString()
              .split(/\r?\n/)
              .filter(Boolean)
              .map(JSON.parse);
          default: return [data];
        } })();

        return messages.forEach(message => this.emit('data', message));
      } catch (error) {
        const {message} = error;
        return this.emit('error', new Error(`\
Subscription error parsing Oanda response:
Message: ${message}
Data string: ${data.toString()}\
`
        )
        );
      }
    });

    this.stream.on('error', error => {
      this.connected = false;
      return this.emit('error', error);
    });

    this.stream.on('end', data => {
      this.connected = false;
      return this.emit('end', data);
    });
  }

  connect() {
    this.stream();
    return this.connected = true;
  }

  disconnect() {
    this.connected = false;
    return this.stream.req.abort();
  }
}

module.exports = Subscription;
