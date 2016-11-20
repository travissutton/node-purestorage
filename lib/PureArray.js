const ArrayApi = require('./array');
const VolumesApi = require('./volumes');
const HostsApi = require('./hosts');
const HgroupsApi = require('./hgroups');
const PgroupsApi = require('./pgroups');
const PortsApi = require('./ports');

/**
 * Pure Array API Object
 * @class
 */
class PureArray {

  constructor (session) {
    this._session = session;
    this.Array = new ArrayApi(this._session);
    this.Volumes = new VolumesApi(this._session);
    this.Hosts = new HostsApi(this._session);
    this.HostGroups = new HgroupsApi(this._session);
    this.ProtectionGroups = new PgroupsApi(this._session);
    this.Ports = new PortsApi(this._session);
  }

}

module.exports = PureArray;
