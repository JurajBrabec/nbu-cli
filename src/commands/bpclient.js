module.exports.ClientStatus = {
  bin: 'admincmd/bpclient',
  args: ['-L', '-client'],
  delimiter: /\r?\n{2}/,
  separator: /\r?\n{2}/,
  fields: {
    name: { type: 'string', regExp: /^Client Name: (\S+)/ },
    offlineBackup: { type: 'string', regExp: /Offline for backup:\s+(\w+)/ },
    offlineRestore: { type: 'number', regExp: /Offline for restore:\s+(\w+)/ },
  },
  assign: (values, assign) => {
    const row = assign(values);
    if (!row.name) return {};
    const text = values.join('');
    Object.keys(row)
      .filter((key) => /offline/.test(key))
      .forEach((key) => {
        const { regExp } = exports.ClientStatus.fields[key];
        const match = text.match(regExp);
        if (match) row[key] = match[1] === 'Yes';
      });
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
