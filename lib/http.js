const request = require('request');

function req (config) {
  return new Promise ((resolve, reject) => {
    request(config, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(body);
        }
      }
    });
  });
}

function get (url) {
  let config = { url };
  return req(config);
}

function post (url, obj) {
  let config = {
    url,
    method: 'POST',
    json: obj
  };
  return req(config);
}

function put (url, obj) {
  let config = {
    url,
    method: 'PUT',
    json: obj
  };
  return req(config);
}

function del (url) {
  let config = {
    url,
    method: 'DELETE',
  };
  return req(config);
}

exports = { req, get, post, put, del };