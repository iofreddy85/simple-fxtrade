/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const axios = require('axios');
const resources = require('./lib');
const Subscription = require('./lib/subscription');
const {omit, assign} = require('./lib/utils');
// const https = require('https');

function SimpleFx() {
  // Return a replacement with the new httpMethod
  var fx = function(method) {
    fx.method = method.toUpperCase();
    return fx;
  };

  // Allows configuration of the fx api
  fx.configure = function(options) {
    return this.options = assign({}, this.options, options);
  };

  // Set the account id context as its needed for most routes
  fx.setAccount = function(id) { return this.options.accountId = id; };

  // Set the accept date time format
  fx.setDateTimeFormat = function(format) {
    if (!['UNIX', 'RFC3339'].includes(format)) {
      throw new Error('invalid date time format');
    }

    return this.options.dateTimeFormat = format;
  };

  // Execute a raw request
  fx.request = function(req, route, checkAccount) {
    if (checkAccount == null) { checkAccount = true; }
    _validateRequest(this.options, checkAccount);

    const method = this.method != null ? this.method : 'GET';
    this.method = null;

    let responseType = 'json';

    if ((req.json != null) && !req.json) { responseType = 'text'; }

    const options = {
      method,
      url: req.url != null ? req.url : this.endpoint(route),
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        'Accept-Datetime-Format': this.options.dateTimeFormat,
        'Accept-Encoding': 'gzip, deflate'
      },
      // httpsAgent: new https.Agent({ keepAlive: true }),
      data: req.body,
      params: omit(req, 'body'),
      responseType
    };

    const deferred = axios(options);

    if (this.options.fullResponse) { return deferred; }

    // TODO: The ? are hacks because of the annoying testdouble framework
    // Need to remove them from here and also from the subscribe below
    return __guard__(deferred != null ? deferred.then(({status, headers, data}) => assign({}, {status, headers}, data)) : undefined, x => x.catch(function(err) {
        // If no response param then return the whole error
        if (!__guard__(err != null ? err.response : undefined, x1 => x1.status)) { return Promise.reject(err); }

        const {response} = err;
        const {status, headers, data} = response;
        return Promise.reject(assign({}, {status, headers}, data));
    }));
  };


  fx.subscribe = function(req, route, checkAccount) {
    if (checkAccount == null) { checkAccount = true; }
    _validateRequest(this.options, checkAccount);

    const options = {
      method: 'GET',
      url: req.url != null ? req.url : this.endpoint(route, 'stream'),
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        'Accept-Datetime-Format': this.options.dateTimeFormat,
        'Accept-Encoding': 'gzip, deflate'
      },
      // httpsAgent: new https.Agent({ keepAlive: true }),
      params: omit(req, 'body'),
      responseType: 'stream'
    };

    this.method = null;

    return __guard__(axios(options), x => x.then(({data}) => new Subscription(data, {json: req.json != null ? req.json : true})));
  };


  // Get the fx api endpoint adjusted per route
  fx.endpoint = function(route, mode) {
    if (route == null) { route = ''; }
    if (mode == null) { mode = 'api'; }
    const {live, version} = this.options;

    if (!['api', 'stream'].includes(mode)) { throw new Error('invalid mode'); }

    switch (false) {
      case !live: return `https://${mode}-fxtrade.oanda.com/${version}/${route}`;
      default: return `https://${mode}-fxpractice.oanda.com/${version}/${route}`;
    }
  };

  // Ensure certain options are set before request execution
  var _validateRequest = function(options, checkAccount) {
    if (!options.apiKey) {
      throw new Error('Api key is not set. Use configure or env OANDA_API_KEY');
    }

    if (checkAccount && !options.accountId) {
      throw new Error('Account id must be set for this request');
    }
  };

  // Ensure deep binding
  const _bindAll = function(source, target) {
    for (let srcName in source) {
      target[srcName] = source[srcName].bind(target);

      for (let fnName in source[srcName]) {
        target[srcName][fnName] = source[srcName][fnName].bind(target);
      }
    }

    return target;
  };

  // Bootstrap the api
  const init = function() {
    // Configure the defaults here
    fx.configure({
      apiKey: process.env.OANDA_API_KEY,
      live: false,
      version: 'v3',
      dateTimeFormat: 'RFC3339',
      throwHttpErrors: true
    });

    // Attach additional functions to the api
    assign(fx, resources);
    _bindAll(resources, fx);
  };

  init();
  return fx;
}

module.exports = SimpleFx;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}