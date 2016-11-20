const EventEmitter = require('events').EventEmitter;
const Http = require('./http');

const Events = new EventEmitter();

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class Session {

  constructor (pureArray, apiVersion) {
    this.pureArray = pureArray;
    this.apiVersion = apiVersion;
    this.url = `https://${pureArray}/api/${apiVersion}/`;
    this.http = new Http();
    this.authenticated = false;
    this.authenticating = false;
  }

  getUrl () {
    return this.url;
  }

  authCheck() {
    return new Promise((resolve, reject) => {
      if(this.authenticated) {
        resolve();
      } else {
        if(this.authenticating) {
          sleep(50)
            .then(() => resolve(this.authCheck()))
            .catch(() => {});
        }
        else {
          reject(new Error('Session is not authenticated'))
        }
      }
    })
  }

  get (url) {
    return this.authCheck()
      .then(() => {
        return this.http.get(url);
      })
      .catch(e => {
        return Promise.reject(e);
      });
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
    this.authenticating = true;
    return new Promise((resolve, reject) => {
      this.http.post(`${this.url}auth/session`, {api_token: apiToken})
        .then(res => {
          if(res.username) {
            this.authenticating = false;
            this.authenticated = true;
            resolve();
          } else {
            console.warn('Session connected but is not valid. Please check API version and token.', res);
            this.authenticating = false;
            reject(res);
          }
        })
        .catch(e => {
          this.authenticating = false;
          Events.emit('error', e);
          reject(e);
        })
    });
  }

}

module.exports = Session;
