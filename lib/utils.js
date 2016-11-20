function parseParamsToUrlString (config, params) {
  let urlParams = [];
  for (let param of params) {
    if (config[param.name]) {
      urlParams.push(`${param.name}=${config[param.name]}`);
    }
  }
  return urlParams.join('&');
}

module.exports = {
  parseParamsToUrlString
};