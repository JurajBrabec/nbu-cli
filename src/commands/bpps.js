const { Services } = require('../maps');

module.exports.Services = {
  bin: 'bpps',
  args: ['-S', '-i', 'NB_SERVER_SERVICES'],
  options: { timeout: 5000 },
  separator: /\s+/,
  fields: {
    name: 'string',
    pid: 'number',
    load: 'string',
    time: 'float',
    mem: 'string',
    startDate: 'string',
    startTime: 'string',
  },
  begin: () => Services.clear(),
  assign: (values, assign) => {
    const row = assign(values);
    Services.set(row.name, row.pid);
    return row;
  },
};
