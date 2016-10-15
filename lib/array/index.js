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




class Array {
  constructor() {
    this.list = require('./list');
  }

  /**
   * creates items needed to make changes to the storage array
   * @param {ArrayConfigSpec} config
   */
  update(config) {
    return({uri: `array`, body: config});
  }
}

module.exports = Array;