module.exports.ClientStatus = {
  bin: 'admincmd/bpclient',
  args: ['-L', '-client'],
  delimiter: /\r?\n{2}/,
  separator: /\r?\n{2}/,
  fields: {
    offlineBackup: { type: 'string', regExp: /Offline for backup: +(\w+)/ },
    offlineRestore: { type: 'number', regExp: /Offline for restore: +(\w+)/ },
  },
  assign: (values, assign) => {
    const row = assign([]);
    const matcher = (field) => {
      const match = values
        .join('')
        .match(exports.ClientStatus.fields[field].regExp);
      if (match) row[field] = match[1] === 'Yes';
    };
    Object.keys(row).forEach((key) => matcher(key));
    return row;
  },
};

module.exports.ClientOffline = {
  bin: 'admincmd/bpclient',
  args: ['-update', '-offline', '-client'],
  fields: {},
};

module.exports.ClientOnline = {
  bin: 'admincmd/bpclient',
  args: ['-update', '-online', '-client'],
  fields: {},
};
