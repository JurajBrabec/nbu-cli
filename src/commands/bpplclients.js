module.exports.Clients = {
  bin: 'admincmd/bpplclients',
  args: ['-allunique', '-l'],
  separator: ' ',
  fields: {
    name: 'string',
    architecture: 'string',
    os: 'string',
    priority: 'number',
    u1: 'number',
    u2: 'number',
    u3: 'number',
  },
  assign: (values, assign) => assign(values.slice(1)),
};
