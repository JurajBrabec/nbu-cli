const Maps = require('../maps');
const { value } = require('../helpers');

module.exports.Summary = {
  bin: 'admincmd/bpdbjobs',
  args: ['-summary', '-l'],
  delimiter: /(\r?\n){2}/,
  separator: /\r?\n/,
  fields: {
    masterServer: { type: 'string', regExp: /Summary of jobs on (\S+)/ },
    queued: { type: 'number', regExp: /Queued:\s+(\d+)/ },
    waiting: { type: 'number', regExp: /Waiting-to-Retry:\s+(\d+)/ },
    active: { type: 'number', regExp: /Active:\s+(\d+)/ },
    successful: { type: 'number', regExp: /Successful:\s+(\d+)/ },
    partial: { type: 'number', regExp: /Partially Successful:\s+(\d+)/ },
    failed: { type: 'number', regExp: /Failed:\s+(\d+)/ },
    incomplete: { type: 'number', regExp: /Incomplete:\s+(\d+)/ },
    suspended: { type: 'number', regExp: /Suspended:\s+(\d+)/ },
    total: { type: 'number', regExp: /Total:\s+(\d+)/ },
  },
};

module.exports.Jobs = {
  bin: 'admincmd/bpdbjobs',
  args: ['-report', '-most_columns'],
  delimiter: /\r?\n/,
  separator: ',',
  fields: {
    jobId: 'number',
    jobType: 'number',
    state: 'number',
    status: 'number',
    policy: 'string',
    schedule: 'string',
    client: 'string',
    server: 'string',
    started: 'number',
    elapsed: 'number',
    ended: 'number',
    stUnit: 'string',
    tries: 'number',
    operation: 'string',
    kBytes: 'number',
    files: 'number',
    pathLastWritten: 'string',
    percent: 'number',
    jobPid: 'number',
    owner: 'string',
    subType: 'number',
    policyType: 'number',
    scheduleType: 'number',
    priority: 'number',
    group: 'string',
    masterServer: 'string',
    retentionLevel: 'number',
    retentionPeriod: 'number',
    compression: 'number',
    kBytesToBeEritten: 'number',
    filesToBeEritten: 'number',
    fileListCount: 'number',
    tryCount: 'number',
    parentJob: 'number',
    kbPerSec: 'number',
    copy: 'number',
    robot: 'string',
    vault: 'string',
    profile: 'string',
    session: 'string',
    ejectTapes: 'string',
    srcStUnit: 'string',
    srcServer: 'string',
    srcMedia: 'string',
    dstMedia: 'string',
    stream: 'number',
    suspendable: 'number',
    resumable: 'number',
    restartable: 'number',
    datamovement: 'number',
    snapshot: 'number',
    backupId: 'string',
    killable: 'number',
    controllingHost: 'number',
    offHostType: 'number',
    ftUsage: 'number',
    reasonString: { type: 'string', maxLength: 128 },
    dedupRatio: 'float',
    accelerator: 'float',
    instanceDbName: 'string',
    rest1: 'string',
    rest2: 'string',
  },
  assign: (values, assign) => {
    const row = assign(values);
    row._ = {
      jobType: value.map(row.jobType, Maps.JobTypes),
      state: value.map(row.state, Maps.JobStates),
      status: value.map(row.status, Maps.StatusTexts),
      started: value.date(row.started),
      elapsed: value.time(row.elapsed),
      ended: value.date(row.ended),
      operation: value.map(row.operation, Maps.JobOperations),
      subType: value.map(row.subType, Maps.JobSubtypes),
      policyType: value.map(row.policyType, Maps.PolicyTypes),
      scheduleType: value.map(row.scheduleType, Maps.ScheduleTypes),
      retentionLevel: value.map(row.retentionLevel, Maps.RetentionLevels),
    };
    return row;
  },
};
