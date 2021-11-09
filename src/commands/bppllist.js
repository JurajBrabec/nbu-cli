const {
  JobSubtypes,
  PolicyTypes,
  ScheduleTypes,
  RetentionLevels,
} = require('../maps');
const { secondsToText, secondsToTime, value } = require('../helpers');

const split = (text) => {
  const ARRAY_ITEMS = ['CLASS', 'INFO', 'RES', 'POOL', 'FOE'];
  const LINE_ITEMS = [
    'NAMES',
    'KEY',
    'BCMD',
    'RCMD',
    'SHAREGROUP',
    'DATACLASSIFICATION',
    'APPLICATIONDEFINED',
    'HYPERVSERVER',
    'ORABKUPDATAFILEARGS',
    'ORABKUPARCHLOGARGS',
  ];
  const INCLUDES = ['INCLUDE'];
  const CLIENTS = ['CLIENT'];
  const SCHEDULES = [
    'SCHED',
    'SCHEDCALDATES',
    'SCHEDCALENDAR',
    'SCHEDCALDAYOWEEK',
    'SCHEDWIN',
    'SCHEDRES',
    'SCHEDPOOL',
    'SCHEDRL',
    'SCHEDFOE',
    'SCHEDSG',
  ];

  const arrayToObject = (items, value) =>
    items.reduce((object, key) => {
      object[key] = value;
      return object;
    }, {});

  const regExp = (items) => new RegExp(`^(${items.join('|')}) ?(.+)?$`, 'gm');

  const assignLinesToObject = (lines, object) =>
    lines.reduce((object, line) => {
      const items = line.split(' ');
      const key = items.shift();
      object[key] = items;
      return object;
    }, object);
  let lines;
  //ARRAY items
  const row = arrayToObject(ARRAY_ITEMS, []);
  lines = text.match(regExp(ARRAY_ITEMS)) || [];
  assignLinesToObject(lines, row);
  //LINE items
  lines = text.match(regExp(LINE_ITEMS)) || [];
  lines.reduce((object, line) => {
    const i = line.indexOf(' ');
    const key = i > 0 ? line.slice(0, i) : line;
    const item = i > 0 ? line.slice(i + 1) : undefined;
    object[key] = item;
    return object;
  }, row);
  //MULTI-LINE items
  row.INCLUDE = [];
  lines = text.match(regExp(INCLUDES)) || [];
  lines.reduce((object, line) => {
    const items = line.split(' ');
    const key = items.shift();
    object[key].push(...items);
    return object;
  }, row);
  //MULTI-ARRAY items
  row.CLIENT = [];
  lines = text.match(regExp(CLIENTS)) || [];
  lines.reduce((object, line) => {
    const items = line.split(' ');
    const key = items.shift();
    object[key].push(items);
    return object;
  }, row);
  //MULTI-MULTI-ARRAY items
  row.SCHED = [];
  text
    .split(new RegExp(`^(?=${SCHEDULES[0]} )`, 'gm'))
    .slice(1)
    .reduce((object, schedule) => {
      const match = schedule.match(regExp(SCHEDULES)) || [];
      const sched = arrayToObject(SCHEDULES, []);
      object.SCHED.push(assignLinesToObject(match, sched));
      return object;
    }, row);
  return row;
};

const assign = (values) => {
  const assignValuesToFields = (fields, values) =>
    Object.entries(fields).reduce((result, [name, type], index) => {
      result[name] = value.cast(values[index], { type });
      return result;
    }, {});
  const policy = assignValuesToFields(exports.Policies.fields.policy, [
    ...values.CLASS,
    ...values.INFO.slice(0, 44),
    values.KEY,
    values.RES[0],
    values.POOL[0],
    values.FOE[0],
    values.SHAREGROUP,
    values.DATACLASSIFICATION,
    values.HYPERVSERVER,
    values.NAMES,
    values.BCMD,
    values.RCMD,
    values.APPLICATIONDEFINED,
    values.ORABKUPDATAFILEARGS,
    values.ORABKUPARCHLOGARGS,
    values.INCLUDE.join(','),
  ]);
  policy.clients = values.CLIENT.map((client) =>
    assignValuesToFields(exports.Policies.fields.client, client)
  );
  policy.schedules = values.SCHED.map((schedule) =>
    assignValuesToFields(exports.Policies.fields.schedule, [
      ...schedule.SCHED,
      schedule.SCHEDCALDATES[0],
      schedule.SCHEDCALENDAR[0],
      schedule.SCHEDCALDAYOWEEK[0],
      ...schedule.SCHEDWIN,
      schedule.SCHEDRES[0],
      schedule.SCHEDPOOL[0],
      schedule.SCHEDRL[0],
      schedule.SCHEDFOE[0],
      schedule.SCHEDSG[0],
    ])
  );
  policy._ = {
    policyType: value.map(policy.policyType, PolicyTypes),
    jobSubtype: value.map(policy.jobSubtype, JobSubtypes),
  };
  policy.schedules.forEach(
    (schedule) =>
      (schedule._ = {
        backupType: value.map(schedule.backupType, ScheduleTypes),
        frequency: secondsToText(schedule.frequency),
        retentionLevel: value.map(schedule.retentionLevel, RetentionLevels),
        win_sun_start: secondsToTime(schedule.win_sun_start),
        win_sun_duration: secondsToText(schedule.win_sun_duration),
        win_mon_start: secondsToTime(schedule.win_mon_start),
        win_mon_duration: secondsToText(schedule.win_mon_duration),
        win_tue_start: secondsToTime(schedule.win_tue_start),
        win_tue_duration: secondsToText(schedule.win_tue_duration),
        win_wed_start: secondsToTime(schedule.win_wed_start),
        win_wed_duration: secondsToText(schedule.win_wed_duration),
        win_thu_start: secondsToTime(schedule.win_thu_start),
        win_thu_duration: secondsToText(schedule.win_thu_duration),
        win_fri_start: secondsToTime(schedule.win_fri_start),
        win_fri_duration: secondsToText(schedule.win_fri_duration),
        win_sat_start: secondsToTime(schedule.win_sat_start),
        win_sat_duration: secondsToText(schedule.win_sat_duration),
      })
  );
  return policy;
};

module.exports.Policies = {
  bin: `admincmd/bppllist`,
  args: ['-allpolicies'],
  delimiter: /\r?\n(?=CLASS)/,
  fields: {
    policy: {
      name: 'string',
      internalname: 'string',
      options: 'number',
      protocolversion: 'number',
      timeZoneOffset: 'number',
      auditReason: 'string',
      policyType: 'number',
      followNfsMount: 'number',
      clientCompress: 'number',
      jobPriority: 'number',
      proxyClient: 'string',
      clientEncrypt: 'number',
      dr: 'number',
      maxJobsPerClient: 'number',
      crossMountPoints: 'number',
      maxFragSize: 'number',
      active: 'number',
      tir: 'number',
      blockLevelIncrementals: 'number',
      extSecInfo: 'number',
      individualFileRestore: 'number',
      streaming: 'number',
      frozenImage: 'number',
      backupCopy: 'number',
      effectiveDate: 'number',
      classId: 'string',
      backupCopies: 'number',
      checkPoints: 'number',
      checkPointInterval: 'number',
      unused: 'number',
      instantRecovery: 'number',
      offHostBackup: 'number',
      alternateClient: 'number',
      dataMover: 'number',
      dataMoverType: 'number',
      bmr: 'number',
      lifeCycle: 'number',
      granularRestore: 'number',
      jobSubtype: 'number',
      vm: 'number',
      ignoreCsDedup: 'number',
      exchangeDbSource: 'number',
      generation: 'number',
      applicationDiscovery: 'number',
      discoveryLifeTime: 'number',
      fastBackup: 'number',
      optimizedBackup: 'number',
      clientListType: 'number',
      selectListType: 'number',
      appConsistent: 'number',
      key: 'string',
      res: 'string',
      pool: 'string',
      foe: 'number',
      shareGroup: 'string',
      dataClassification: 'string',
      hypervServer: 'string',
      names: 'string',
      bcmd: 'string',
      rcmd: 'string',
      applicationDefined: 'string',
      oraBkupDataFileArgs: 'string',
      oraBkupArchLogArgs: 'string',
      include: 'string',
    },
    client: {
      name: 'string',
      architecture: 'string',
      os: 'string',
      field1: 'number',
      field2: 'number',
      field3: 'number',
      field4: 'number',
    },
    schedule: {
      name: 'string',
      backupType: 'number',
      multiplexingCopies: 'number',
      frequency: 'number',
      retentionLevel: 'number',
      reserved1: 'number',
      reserved2: 'number',
      reserved3: 'number',
      alternateReadServer: 'string',
      maxFragmentSize: 'number',
      calendar: 'number',
      copies: 'number',
      foe: 'number',
      synthetic: 'number',
      pfiFastRecover: 'number',
      priority: 'number',
      storageService: 'number',
      checksumDetection: 'number',
      calDates: 'string',
      calRetries: 'string',
      calDayOfWeek: 'string',
      win_sun_start: 'number',
      win_sun_duration: 'number',
      win_mon_start: 'number',
      win_mon_duration: 'number',
      win_tue_start: 'number',
      win_tue_duration: 'number',
      win_wed_start: 'number',
      win_wed_duration: 'number',
      win_thu_start: 'number',
      win_thu_duration: 'number',
      win_fri_start: 'number',
      win_fri_duration: 'number',
      win_sat_start: 'number',
      win_sat_duration: 'number',
      schedRes: 'string',
      schedPool: 'string',
      schedRL: 'number',
      schedFoe: 'number',
      schedSg: 'string',
    },
  },
  split,
  assign,
};
