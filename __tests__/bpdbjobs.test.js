const { Parser } = require('../lib/parsedFileOutput');
const { Summary, Jobs } = require('../src/commands/bpdbjobs.js');
const { value } = require('../src/helpers');

const JOBS_TEXT = `123456,0,3,0,POLICY_NAME,incr,client.test,server.test,1636329629,0000000067,1636329696,ST_UNIT,1,,247834,13,,100,169815,root,1,13,4,0,root,masterServer.test,1,37,0,,,0,0,123456,110197,,,,,,,,,,,3,,,1,0,0,client.test_1636329655,,,0,0, ,89.699997,58.799999,,,102225,, ,0,,58.299999,31.400000`;
const JOBS_RESULT = `{"jobId":123456,"jobType":0,"state":3,"status":0,"policy":"POLICY_NAME","schedule":"incr","client":"client.test","server":"server.test","started":1636329629,"elapsed":67,"ended":1636329696,"stUnit":"ST_UNIT","tries":1,"operation":null,"kBytes":247834,"files":13,"pathLastWritten":null,"percent":100,"jobPid":169815,"owner":"root","subType":1,"policyType":13,"scheduleType":4,"priority":0,"group":"root","masterServer":"masterServer.test","retentionLevel":1,"retentionPeriod":37,"compression":0,"kBytesToBeEritten":null,"filesToBeEritten":null,"fileListCount":0,"tryCount":0,"parentJob":123456,"kbPerSec":110197,"copy":null,"robot":null,"vault":null,"profile":null,"session":null,"ejectTapes":null,"srcStUnit":null,"srcServer":null,"srcMedia":null,"dstMedia":null,"stream":3,"suspendable":null,"resumable":null,"restartable":1,"datamovement":0,"snapshot":0,"backupId":"client.test_1636329655","killable":null,"controllingHost":null,"offHostType":0,"ftUsage":0,"reasonString":null,"dedupRatio":89.699997,"accelerator":58.799999,"instanceDbName":null,"rest1":null,"rest2":"102225","_":{"jobType":"Backup","state":"Done","status":"the requested operation was successfully completed","started":"2021-11-08 01:00:29","elapsed":"00:01:07","ended":"2021-11-08 01:01:36","operation":null,"subType":"Scheduled","policyType":"MS-Windows","scheduleType":"Cummulative","retentionLevel":1}}`;
const SUMMARY_TEXT = `Summary of jobs on masterServer.test
Queued:                                0
Waiting-to-Retry:                        0
Active:                           1
Successful:                      32
Partially Successful:            17
Failed:                          10
Incomplete:                       0
Suspended:                        0
Total:                           60
`;
const SUMMARY_RESULT = `{"masterServer":"masterServer.test","queued":0,"waiting":0,"active":1,"successful":32,"partial":17,"failed":10,"incomplete":0,"suspended":0,"total":60}`;

describe('BPDBJOBS', () => {
  describe('Jobs', () => {
    it('should parse Job object', () => {
      Jobs.cast = value.cast;
      const parser = Parser(Jobs);
      const result = parser(JOBS_TEXT);
      expect(result).toEqual(JSON.parse(JOBS_RESULT));
    });
  });
  describe('Summary', () => {
    it('should parse Summary object', () => {
      Summary.cast = value.cast;
      const parser = Parser(Summary);
      const result = parser(SUMMARY_TEXT);
      expect(result).toEqual(JSON.parse(SUMMARY_RESULT));
    });
  });
});
