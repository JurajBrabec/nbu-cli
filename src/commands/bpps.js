const { Services } = require('../maps');
const { platformSpecific } = require('../helpers/system');

module.exports.Services = platformSpecific(
  {
    bin: 'bpps',
    args: [],
    fields: {
      name: 'string',
    },
    options: { timeout: 5000 },
    separator: /\s+/,
    begin: () => Services.clear(),
    assign: (values, assign) => {
      const row = assign(values);
      row.name = row.name.split('/').pop();
      Services.set(row.name, row.pid);
      return row;
    },
  },
  {
    linux: {
      args: [],
      fields: {
        uid: 'string',
        pid: 'number',
        ppid: 'number',
        c: 'number',
        stime: 'string',
        tty: 'string',
        time: 'string',
        name: 'string',
      },
    },
    win32: {
      args: ['-S', '-i', 'NB_SERVER_SERVICES'],
      fields: {
        name: 'string',
        pid: 'number',
        load: 'string',
        time: 'float',
        mem: 'string',
        startDate: 'string',
        startTime: 'string',
      },
    },
  }
);
