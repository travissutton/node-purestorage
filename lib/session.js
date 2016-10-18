const EventEmitter = require('events').EventEmitter;
const Http = require('./http');

const Events = new EventEmitter();

class Session {

  constructor (pureArray, apiVersion) {
    this.pureArray = pureArray;
    this.apiVersion = apiVersion;
    this.url = `https://${pureArray}/api/${apiVersion}/`;
    this.http = new Http();
  }

  getUrl () {
    return this.url;
  }

  get (url) {
    return this.http.get(url);
  }

  update (url, object) {
    return this.http.put(url, object);
  }

  destroy (url) {
    return this.http.del(url);
  }

  /**
   * authenticates to the storage array using username/password to generate an API token
   * @param {string} username
   * @param {string} password
   * @returns {Promise<string>}
   */
  getToken (username, password) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.url}auth/apitoken`, {username, password})
        .then(res => {
          Events.emit('session-tokenOk');
          this.apiToken = res.api_token;
          resolve(this.apiToken);
        })
        .catch(e => {
          Events.emit('session-error', {message: 'Unable to authenticate to Pure Array', error: e});
          reject('Unable to authenticate to storage system.');
        });
    });
  }

  /**
   * authenticates a new API session to the storage array
   * @param {string} apiToken
   * @returns {Promise}
   */
  authSession (apiToken) {
    return this.http.post(`${this.url}auth/session`, {api_token: apiToken});
  }

}

module.exports = Session;
