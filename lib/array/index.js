/**
 * Pure Storage Array
 * @class
 * @property {string} url
 */
class PureArray {

  constructor (session) {

    /** @private */
    this._session = session;
    this.url = `${this._session.getUrl()}array`;

  }

  /**
   * @typedef {Object} ArrayConfigSpec
   * @property {string} [banner]
   * @property {number} [idle_timeout]
   * @property {string} [name]
   * @property {Array<string>} [ntpserver]
   * @property {string} [proxy]
   * @property {string} [relayhost]
   * @property {number} [scsi_timeout]
   * @property {string} [senderdomain]
   * @property {Array<string>} [syslogserver]
   */

  /**
   * creates items needed to make changes to the storage array
   * @param {ArrayConfigSpec} config
   */
  update (config) {
    this._session.update(this.url, config);
  }

  //@todo add connection throttling update method

  //@todo add console lock update method

  //@todo add phone home update method

  //@todo add remote assist update method

  //@todo add delete array connection method

  /**
   * @typedef {string} PerfInterval
   * valid options are: `1h`, `3h`, `24h`, `7d`, `30d`, `90d`, and `1y`.
   */

  /**
   * Returns configured attributes for arrays
   * @returns {*}
   */
  attributes () {
    return this._session.get(this.url);
  }

  /**
   * Returns controllers
   * @memberOf! PureArray
   * @returns {*}
   */
  controllers () {
    return this._session.get(`${this.url}?controllers=true`);
  }

  /**
   * Returns space (or historical) usage for arrays
   * @param {PerfInterval|null} [interval]
   * @returns {Promise}
   */
  capacity (interval = null) {
    let url = `${this.url}?space=true`;
    if (interval) {
      url = `${url}&historical=${interval}`;
    }
    return this._session.get(url);
  }

  /**
   * Returns real-time or historical performance for arrays
   * @param {PerfInterval|null} [interval]
   * @returns {Promise}
   */
  performance (interval = null) {
    let url = `${this.url}?action=monitor`;
    if (interval) {
      url = `${url}&historical=${interval}`;
    }
    return this._session.get(url);
  }

  /**
   *
   * @returns {*}
   */
  connections () {
    return this._session.get(`${this.url}/connection`);
  }

  /**
   *
   * @returns {*}
   */
  lockStatus () {
    return this._session.get(`${this.url}/console_lock`);
  }

  /**
   *
   * @returns {*}
   */
  phonehomeStatus () {
    return this._session.get(`${this.url}/phonehome`);
  }

  /**
   *
   * @returns {*}
   */
  remoteAssistStatus () {
    return this._session.get(`${this.url}/remoteassist`);
  }

}

module.exports = PureArray;