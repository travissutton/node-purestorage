/**
 * Pure Storage Volume
 */
class Volumes {

  constructor (session) {
    this._session = session;
    this.url = `${this._session.getUrl()}volume`;

    this.parameters = [
      {name: 'action', type: 'string', values: ['monitor'], optional: true},
      {name: 'historical', type: 'string', values: ['1h', '3h', '24h', '7d', '30d', '90d', '1y'], optional: true},
      {name: 'pending', type: 'boolean', optional: true},
      {name: 'pending_only', type: 'boolean', optional: true},
      {name: 'pgrouplist', type: 'array', optional: true},
      {name: 'snap', type: 'boolean', optional: true},
      {name: 'space', type: 'boolean', optional: true},
      {name: 'action', type: 'string', optional: true}
    ];
  }

  /**
   * @typedef {Object} VolCreateOptions
   * @param {boolean} [overwrite] - When used with `source`, overwrites (`true`) an existing volume.
   *
   * @param {number|string} [size] - Creates a volume with the specified provisioned size.
   * Enter the size as a number (bytes) or as a string with a single character unit symbol. Valid unit
   * symbols are `K`,`M`, `G`, `T`, `P`, representing KiB, MiB, GiB, TiB, and PiB, respectively,
   * where "Ki" denotes 2^10, "Mi" denotes 2^20, and so on. If the unit symbol is not specified,
   * the unit defaults to bytes.
   *
   * @param {string} [source] - Copies a volume or snapshot to create a new volume or replace an
   * existing one. Specify the name of a volume or snapshot whose data is copied to the volume specified.
   * If the volume or snapshot replaces an existing volume, the `overwrite` parameter must also be
   * specified. If the volume or snapshot replaces an existing volume, an undo snapshot is automatically
   * taken (providing a 24-hour window during which the previous contents can be retrieved).
   */

  /**
   * Creates a volume or copies a volume or snapshot. Either the `size` or `source` parameter must be specified.
   * @param {string} id - Volume ID
   * @param {VolCreateOptions} options
   */
  create (id, options) {
    let url = `${this.url}/${id}`;
    return this._session.post(url, options)
  }

  /**
   * Creates snapshots of one or more volumes.
   * @param {string|Array<string>} source - Names of one or more volumes to snapshot.
   * @param {string} [suffix] - Specify a custom suffix that is added to the snapshot name.
   * @returns {Promise}
   */
  snapshot (source, suffix = null) {

    // if array is string, covert to single array
    if (!Array.isArray(source)) {
      source = [source];
    }
    let options = {snap: true, source};
    if (suffix) {
      options.suffix = suffix;
    }
    return this._session.post(this.url, options);
  }

  /**
   * @typedef {Object} VolUpdateOptions
   * @param {string} [action] - Recovers the contents of the specified volume or volume snapshot.
   * Set the parameter to recover.
   *
   * @param {string} [name] - Renames the specified volume or volume snapshot.
   * When renaming a snapshot, only the suffix can be changed.
   *
   * @param {number|string} [size] - Changes the provisioned size of the volume. If the new volume size
   * is smaller than the original, then the `truncate` parameter needs to be set to true.
   * Enter the size as a number (bytes) or as a string with a single character unit symbol. Valid unit
   * symbols are `K`, `M`, `G`, `T`, `P`, representing KiB, MiB, GiB, TiB, and PiB, respectively, where "Ki"
   * denotes 2^10, "Mi" denotes 2^20, and so on. If the unit symbol is not specified, the unit defaults to bytes.
   *
   * @param {boolean} truncate - Truncates (true) the volume. When a volume is truncated, Purity
   * automatically takes an undo snapshot, providing a 24-hour window during which the previous
   * contents can be retrieved. After truncating a volume, its provisioned size can be subsequently
   * increased, but the data in truncated sectors cannot be retrieved.
   * Required if the volume size is set to a size that is smaller than the original.
   */

  /**
   * Recovers and renames the specified volume or volume snapshot, or resizes the specified volume.
   * Either the `size`, `action` or `name` parameter must be specified.
   * @param {string} id - Volume ID
   * @param {VolUpdateOptions} options
   */
  update (id, options) {
    return this._session.put(`${this.url}/${id}`, options);
  }

  /**
   * Destroys or eradicates the specified volume or snapshot.
   * @param {string} id - Volume ID
   * @param {boolean} [eradicate] - If set to `true`, eradicates the specified volume or snapshot.
   * If destroying or eradicating a volume, its snapshots are also destroyed or eradicated.
   *
   *After destroying a volume or snapshot, you can eradicate it to immediately terminate the
   * 24-hour eradication period and begin storage reclamation. Once eradication has begun,
   * the volume or snapshot can no longer be recovered.
   *
   * If set to `false`, destroys the specified volume or snapshot. The destroyed volume or snapshot
   * undergoes a 24-hour eradication pending period during which time the volume or snapshot
   * and its data can be fully recovered. After the 24-hour pending period, Purity eradicates the
   * destroyed volume or snapshot.
   *
   * @returns {Promise}
   */
  destroy (id, eradicate = false) {
    let url = `${this.url}/${id}`;
    if (eradicate) {
      url = `${url}?eradicate=true`;
    }
    return this._session.del(url);
  }

  /**
   * @typedef {Object} VolFilter
   * @property {boolean} [pending] - include pending volumes
   * @property {boolean} [pending_only] - only show volumes pending deletion
   */

  /**
   * List all volumes
   * @param {VolFilter} [options] - volume filter options
   * @returns {Promise}
   */
  list (options = {}) {
    let url = this.url;
    if (options.pending) {
      url = `${url}?pending=true`;
    } else if (options.pending_only) {
      url = `${url}?pending_only=true`;
    }
    return this._session.get(url);
  }

  /**
   * Fetches a specific volume
   * @param {string} id
   * @returns {*}
   */
  fetch (id) {
    return this._session.get(`{this.url}/${id}`);
  }

  /**
   * fetches snapshots for volumes with option to specify protection groups
   * @param {string|null} id - Volume id
   * @param {Array} [pgrouplist]
   * @returns {Promise}
   */
  snapshots (id = null, pgrouplist = []) {
    let url = this.url;
    if (id) {
      url = `${url}/${id}`
    }
    url = `${url}?snap=true`;
    if (pgrouplist.length > 0) {
      url = `${url}&pgrouplist=${pgrouplist}`;
    }
    return this._session.get(url);
  }

  /**
   * List per volume space usage
   * @param {string|null} [id]
   * @returns {Promise}
   */
  capacity (id = null) {
    let url = this.url;
    if (id) {
      url = `${url}/${id}`
    }
    return this._session.get(`${url}?space=true`);
  }

  /**
   * List real-time performance data
   * @param {string|null} [id]
   * @param {PerfInterval|null} [interval]
   * @returns {Promise}
   */
  performance (id = null, interval = null) {
    let url = this.url;
    if (id) {
      url = `${url}/${id}`;
    }
    url = `${url}?action=monitor`;
    if (interval) {
      url = `${url}&historical=${interval}`;
    }
    return this._session.get(url);
  }

  /**
   * @typedef {Object} VolDiffParameters
   * @property {string} [base] - Volume or snapshot name to be used as the base for the diff. If a base volume or snapshot is not specified, all
   mapped blocks for the volume are returned.
   * @property {number|string} block_size - Granularity, in bytes, at which to compare.
   * @property {number|string} length - Length of the region, in bytes, to compare.
   * @property {number|string} [offset] - Absolute offset, in bytes, of the region to compare. Must be a multiple of block_size.
   */

  /**
   * Lists block differences for the specified volume
   * @param {string} id
   * @param {VolDiffParameters} options
   * @returns {Promise}
   */
  diff (id, options) {
    let valid = ['base', 'block_size', 'length', 'offset'];
    let keys = Object.keys(options);

    let url = `${this.url}/${id}`;

    if (keys.length > 0) {
      if (keys.indexOf('block_size') !== -1 && keys.indexOf('length') !== -1) {
        let first = true;
        for (let key of keys) {
          if (valid.indexOf(key) > -1) {
            if (first) {
              url = `${url}?${key}=${options[key]}`;
              first = false;
            } else {
              url = `${url}&${key}=${options[key]}`;
            }
          }
        }
      }
    } else {
      throw new Error('Options not valid. Parameters block_size and length required.');
    }

    return this._session.get(url);
  }

  /**
   * List shared connections for volume
   * @param {string} id
   * @returns {Promise}
   */
  hgroup (id) {
    return this._session.get(`${this.url}/${id}/hgroup`);
  }

  /**
   * Lists private connections for the specified volume.
   * @param {string} id
   * @returns {Promise}
   */
  hosts (id) {
    return this._session.get(`${this.url}/${id}/host`);
  }

}

module.exports = Volumes;
