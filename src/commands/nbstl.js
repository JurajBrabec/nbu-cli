const { SLPUses, RetentionLevels } = require('../maps');
const { value } = require('../helpers');

module.exports.SLPs = {
  bin: 'admincmd/nbstl',
  args: ['-l'],
  delimiter: /\r?\n(?=[A-Za-z]+)/,
  separator: ' ',
  fields: {
    slpName: 'string',
    dataClassification: 'string',
    duplicationPriority: 'number',
    state: 'string',
    version: 'number',
    useFor: 'number',
    storageUnit: 'string',
    volumePool: 'string',
    mediaOwner: 'string',
    retentionType: 'number',
    retentionLevel: 'number',
    alternateReadServer: 'string',
    preserveMpx: 'number',
    ddoState: 'string',
    source: 'number',
    unused: 'number',
    operationId: 'number',
    operationIndex: 'number',
    slpWindow: 'string',
    targetMaster: 'string',
    targetMasterSlp: 'string',
  },
  split: (text, split) => {
    if (text.match(/no entity vas found/)) return false;
    const lines = text.split(/\r?\n/);
    return lines
      .slice(1)
      .map((item) => [lines[0], item.trim()].join(' '))
      .map(split);
  },
  assign: (values, assign) => {
    const row = assign(values);
    row._ = {
      useFor: value.map(row.useFor, SLPUses),
      retentionLevel: value.map(row.retentionLevel, RetentionLevels),
    };
    return row;
  },
};
