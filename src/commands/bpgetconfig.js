module.exports.ClientConfig = {
  bin: 'admincmd/bpgetconfig',
  args: ['-l', '-g'],
  delimiter: /\r?\n/,
  separator: ';',
  fields: {
    clientMaster: 'string',
    platform: 'string',
    protocolLevel: 'string',
    product: 'string',
    versionName: 'string',
    versionNumber: 'number',
    installationPath: 'string',
    os: 'string',
  },
  split: (text, split) => (text.match(/;/) ? split(text) : [text]),
};
