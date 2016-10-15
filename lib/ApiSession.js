
const http = require('./http');


class ApiSession {

  constructor(pureArray, apiVersion) {
    this.pureArray = pureArray;
    this.apiVersion = apiVersion;
    this.url = `https://${pureArray}/api/${apiVersion}/`;
  }

  get (resource) {}

  getToken(username, password) {
    return new Promise((resolve, reject) => {
      http.post(`${this.url}auth/apitoken`, {username, password})
        .then(res => {
          this.apiToken = res.api_token;
          resolve(this.apiToken);
        })
        .catch(e => {
          console.log('Error authenticating to Pure Array', e);
          reject('Unable to authenticate to storage system.');
        });
    });
  }

  authSession(apiToken) {
    return http.post(`${this.url}auth/session`, {api_token: apiToken});
  }

}
