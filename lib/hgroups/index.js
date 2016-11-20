const utils = require('../utils');

/**
 * Pure HostGroups API Module
 * @class
 * @property {Object} session
 * @property {string} url
 * @property {Object[]} parameters - base parameters for the HostGroups object
 */
class HostGroups {

  constructor (session) {
    this._session = session;
    this.url = `${this._session.getUrl()}hgroup`;

    this.parameters = [
      {name: 'action', type: 'string', values: ['monitor'], optional: true},
      {name: 'space', type: 'boolean', optional: true}
    ];
  }

  list(options={}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}`: `${this.url}?${opts}`;
    return this._session.get(url);
  }

  fetch(hgroupId, options = {}) {
    let opts = utils.parseParamsToUrlString(options, this.parameters);
    let url = (opts === '') ? `${this.url}/${hgroupId}`: `${this.url}/${hgroupId}?${opts}`;
    return this._session.get(url);
  }

  volumes(hgroupId) {
    let url = `${this.url}/${hgroupId}/volume`;
    return this._session.get(url);
  }

}

module.exports = HostGroups;
