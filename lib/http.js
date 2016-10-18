const request = require('request');
const EventEmitter = require('events').EventEmitter;

const Events = new EventEmitter;

/**
 * HTTP Wrapper for `request` package
 * @class
 */
class Http {
  constructor () {
  }

  /**
   * base request wrapper with Promise implementation; uses the `request` library
   * @param {Object} config
   * @returns {Promise}
   */
  req (config) {
    return new Promise((resolve, reject) => {
      request(config, (err, res, body) => {
        if (err) {
          Events.emit('http-error', {request: config, error: err});
          reject(err);
        } else {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve(body);
          }
        }
      });
    });
  }

  /**
   * convenience function for GET requests
   * @param {string} url
   * @returns {Promise}
   */
  get (url) {
    let config = {url};
    return this.req(config);
  }

  /**
   *convenience function for POST requests
   * @param {string} url
   * @param {Object} obj
   * @returns {Promise}
   */
  post (url, obj) {
    let config = {url, method: 'POST', json: obj};
    return this.req(config);
  }

  /**
   * convenience function for PUT requests
   * @param {string} url
   * @param {Object} obj
   * @returns {Promise}
   */
  put (url, obj) {
    let config = {url, method: 'PUT', json: obj};
    return this.req(config);
  }

  /**
   * convenience function for DELETE requests, exports as `delete`.
   * @param {string} url
   * @returns {Promise}
   */
  del (url) {
    let config = {url, method: 'DELETE',};
    return this.req(config);
  }

}

module.exports = Http;