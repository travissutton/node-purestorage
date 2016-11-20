const utils = require('../utils');

/**
 * Pure ProtectionGroups API Module
 * @class
 * @property {Object} session
 * @property {string} url
 * @property {Object[]} parameters - base parameters for the HostGroups object
 */
class ProtectionGroups {

  constructor (session) {
    this._session = session;
    this.url = `${this._session.getUrl()}pgroup`;

    this.parameters = [
      {name: 'pending', type: 'boolean', optional: true},
      {name: 'pending_only', type: 'boolean', optional: true},
      {name: 'retention', type: 'boolean', optional: true},
      {name: 'schedule', type: 'boolean', optional: true},
      {name: 'snap', type: 'boolean', optional: true},
      {name: 'source', type: 'boolean', optional: true},
      {name: 'space', type: 'boolean', optional: true},
      {name: 'target', type: 'boolean', optional: true},
      {name: 'total', type: 'boolean', optional: true},
      {name: 'transfer', type: 'boolean', optional: true}
    ];
  }

  list(options={}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}`: `${this.url}?${opts}`;
    return this._session.get(url);
  }

  fetch(pgroupId, options = {}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}/${pgroupId}`: `${this.url}/${pgroupId}?${opts}`;
    return this._session.get(url);
  }

}

module.exports = ProtectionGroups;
