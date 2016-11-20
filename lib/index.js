'use strict';

const Session = require('./session');
const PureArray = require('./PureArray');

/**
 * Connects to a designated Pure Array and returns a PureStorage Object
 * @param address
 * @param apiVersion
 * @param apiToken
 * @returns {PureArray}
 */
module.exports = (address, apiVersion, apiToken) => {
    let sess = new Session(address, apiVersion);
    let conn = new PureArray(sess);
    sess.authSession(apiToken)
      .catch(e => {
        console.error('Error attempting to authenticate session', e);
      });
  return conn;
};

