const { Logins } = require('../maps');

module.exports.Login = {
  bin: 'bpnbat',
  args: ['-login'],
  delimiter: /(\r?\n){2}/,
  separator: /\r?\n/,
  fields: {
    output: 'string',
  },
};

module.exports.Logout = {
  bin: 'bpnbat',
  args: ['-logout'],
  delimiter: /(\r?\n){2}/,
  separator: /\r?\n/,
  fields: {
    output: 'string',
  },
};

module.exports.Whoami = {
  bin: 'bpnbat',
  args: ['-whoami'],
  delimiter: /\r?\n(?=\w+ login details)/,
  separator: /\r?\n/,
  fields: {
    type: { type: 'string', regExp: /^(\w+) login details/ },
    name: { type: 'string', regExp: /Name: (.+)/ },
    domain: { type: 'string', regExp: /Domain: (.+)/ },
    issuer: { type: 'string', regExp: /Issued by: (.+)/ },
    expiration: { type: 'string', regExp: /Expiry Date: (.+)/ },
    method: { type: 'string', regExp: /Authentication method: (.+)/ },
  },
  begin: () => (Logins.length = 0),
  split: (text, split) => (text.match(/^\w+/) ? split(text) : false),
  assign: (values, assign) => {
    const row = assign(values.filter((v) => v.match(/\w/)));
    Logins.push(row);
    return row;
  },
};
