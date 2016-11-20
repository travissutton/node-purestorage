const utils = require('../utils');

/**
 * Pure Hosts API Module
 * @class
 * @property {Object} session
 * @property {string} url
 * @property {Object[]} parameters - base parameters for the Host object
 */
class Hosts {

  constructor (session) {
    this._session = session;
    this.url = `${this._session.getUrl()}host`;

    this.parameters = [
      {name: 'action', type: 'string', values: ['monitor'], optional: true},
      {name: 'personality', type: 'boolean', optional: true},
      {name: 'chap', type: 'boolean', optional: true},
      {name: 'space', type: 'boolean', optional: true},
      {name: 'all', type: 'string', optional: true}
    ];
  }

  list(options={}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}`: `${this.url}?${opts}`;
    return this._session.get(url);
  }

  fetch(hostId, options = {}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}/${hostId}`: `${this.url}/${hostId}?${opts}`;
    return this._session.get(url);
  }

  volumes(hostId, options ={}) {
    let params = [{name: 'private', type: 'boolean'}, {name: 'shared', type: 'boolean'}];
    let opts = utils.parseParamsToUrlString(options, params);
    let url = (opts === '') ? `${this.url}/${hostId}/volume`: `${this.url}/${hostId}/volume?${opts}`;
    return this._session.get(url);
  }

}

module.exports = Hosts;
