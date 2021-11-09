const { RetentionLevels } = require('../maps');

module.exports.RetentionLevels = {
  bin: 'admincmd/bpretlevel',
  args: ['-L'],
  delimiter: /\r?\n/,
  separator: /\(|\)/,
  fields: {
    level: { index: 0, type: 'number', regExp: /^(\d+)/ },
    days: { index: 0, type: 'number', regExp: /\s+(\d+)/ },
    seconds: { index: 1, type: 'number' },
    period: { index: 2, type: 'string' },
  },
  begin: () => RetentionLevels.clear(),
  split: (text, split) => (text.match(/^\d/) ? split(text) : false),
  assign: (values, assign) => {
    const row = assign(values);
    RetentionLevels.set(row.level, row.period);
    return row;
  },
};
