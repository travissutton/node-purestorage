const request = require('request');
const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const EventEmitter = require('events').EventEmitter;

const Events = new EventEmitter;

/**
 * HTTP Wrapper for `request` package
 * @class
 */
class Http {
  constructor () {
    this.cookie = null;
  }

  /**
   * base request wrapper with Promise implementation; uses the `request` library
   * @param {Object} config
   * @returns {Promise}
   */
  req (config) {
    config.strictSSL = false;
    if(this.cookie) {
      if(config.headers) {
        config.headers = Object.assign({}, {cookie: this.cookie}, config.headers)
      } else {
        config.headers = { cookie: this.cookie };
      }
    }
    return new Promise((resolve, reject) => {
      request(config, (err, res, body) => {
        if (err) {
          Events.emit('http-error', {request: config, error: err});
          reject(err);
        } else {
          if(res.headers['set-cookie']) {
            if (res.headers['set-cookie'] instanceof Array) {
              this.cookie = res.headers['set-cookie'].map(Cookie.parse);
            }
            else {
              this.cookie = [Cookie.parse(res.headers['set-cookie'])];
            }
          }
          resolve(body);
        }
      });
    });
  }

  /**
   * convenience function for GET requests
   * @param {string} url
   * @param {*} [options] - Request single instance options
   * @returns {Promise}
   */
  get (url, options = {}) {
    let config = {url, json: true};
    Object.keys(options).forEach(option => config[option] = options[option]);
    return this.req(config);
  }

  /**
   *convenience function for POST requests
   * @param {string} url
   * @param {Object} obj
   * @param {*} [options] - Request single instance options
   * @returns {Promise}
   */
  post (url, obj, options = {}) {
    let config = {url, method: 'POST', json: obj};
    Object.keys(options).forEach(option => config[option] = options[option]);
    return this.req(config);
  }

  /**
   * convenience function for PUT requests
   * @param {string} url
   * @param {Object} obj
   * @param {*} [options] - Request single instance options
   * @returns {Promise}
   */
  put (url, obj, options = {}) {
    let config = {url, method: 'PUT', json: obj};
    Object.keys(options).forEach(option => config[option] = options[option]);
    return this.req(config);
  }

  /**
   * convenience function for DELETE requests, exports as `delete`.
   * @param {string} url
   * @param {*} [options] - Request single instance options
   * @returns {Promise}
   */
  del (url, options = {}) {
    let config = {url, method: 'DELETE',};
    Object.keys(options).forEach(option => config[option] = options[option]);
    return this.req(config);
  }

}

module.exports = Http;