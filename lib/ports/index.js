const utils = require('../utils');

/**
 * Pure Connection Port API Module
 * @class
 * @property {Object} session
 * @property {string} url
 * @property {Object[]} parameters - base parameters for the Port object
 */
class Ports {

  constructor (session) {
    this._session = session;
    this.url = `${this._session.getUrl()}port`;

    this.parameters = [
      {name: 'initiators', type: 'boolean', optional: true}
    ];
  }

  list(options={}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}`: `${this.url}?${opts}`;
    return this._session.get(url);
  }

  fetch(id, options = {}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}/${id}`: `${this.url}/${id}?${opts}`;
    return this._session.get(url);
  }

}

module.exports = Ports;
