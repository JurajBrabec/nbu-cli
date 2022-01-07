const { Parser } = require('../lib/parsedFileOutput');
const { Policies } = require('../src/commands/bppllist.js');

const POLICIES_TEXT = `CLASS POLICY_NAME *NULL* 0 910000 194400 *NULL*
NAMES
INFO 0 1 0 0 *NULL* 0 0 32 1 0 0 2 0 0 0 0 0 0 1571133557 48CBB9A983594562AEB1F6E69FAC05AD 1 0 0 0 0 0 0 0 2 1 0 0 0 0 1 3 6 0 0 1 0 0 0 1 0 4 300 0 0
KEY *NULL*
BCMD *NULL*
RCMD *NULL*
RES STU_NAME *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
POOL NetBackup NetBackup NetBackup NetBackup NetBackup NetBackup NetBackup NetBackup NetBackup NetBackup
FOE 0 0 0 0 0 0 0 0 0 0
SHAREGROUP *ANY*
DATACLASSIFICATION *NULL*
APPLICATIONDEFINED *NULL*
CLIENT client.test Linux RedHat2.6.32 0 0 0 *NULL*
CLIENT client1.test Linux RedHat2.6.32 0 0 0 *NULL*
INCLUDE ALL_LOCAL_DRIVES
SCHED full 0 1 604800 0 0 0 0 *NULL* 0 0 0 0 0 0 -1 1 0
SCHEDWIN 0 0 0 0 0 0 0 0 0 0 79200 14400 0 0
SCHEDRES RES_NAME *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHEDPOOL *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHEDRL 0 1 1 1 1 1 1 1 1 1
SCHEDFOE 0 0 0 0 0 0 0 0 0 0
SCHEDSG *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHED full_forced 0 1 604800 0 0 0 0 *NULL* 0 1 0 0 0 0 -1 1 1
SCHEDCALENDAR 
SCHEDCALDAYOWEEK 6,5
SCHEDWIN 0 0 0 0 0 0 0 0 0 0 79200 14400 0 0
SCHEDRES RES_NAME *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHEDPOOL *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHEDRL 0 1 1 1 1 1 1 1 1 1
SCHEDFOE 0 0 0 0 0 0 0 0 0 0
SCHEDSG *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHED incr 4 1 86400 0 0 0 0 *NULL* 0 0 0 0 0 0 -1 1 0
SCHEDWIN 79200 14400 79200 14400 79200 14400 79200 14400 79200 14400 0 0 79200 14400
SCHEDRES RES1_NAME *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHEDPOOL *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
SCHEDRL 0 1 1 1 1 1 1 1 1 1
SCHEDFOE 0 0 0 0 0 0 0 0 0 0
SCHEDSG *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL* *NULL*
`;

const POLICIES_RESULT = `{"name":"POLICY_NAME","internalname":null,"options":0,"protocolversion":910000,"timeZoneOffset":194400,"auditReason":null,"policyType":0,"followNfsMount":1,"clientCompress":0,"jobPriority":0,"proxyClient":null,"clientEncrypt":0,"dr":0,"maxJobsPerClient":32,"crossMountPoints":1,"maxFragSize":0,"active":0,"tir":2,"blockLevelIncrementals":0,"extSecInfo":0,"individualFileRestore":0,"streaming":0,"frozenImage":0,"backupCopy":0,"effectiveDate":1571133557,"classId":"48CBB9A983594562AEB1F6E69FAC05AD","backupCopies":1,"checkPoints":0,"checkPointInterval":0,"unused":0,"instantRecovery":0,"offHostBackup":0,"alternateClient":0,"dataMover":0,"dataMoverType":2,"bmr":1,"lifeCycle":0,"granularRestore":0,"jobSubtype":0,"vm":0,"ignoreCsDedup":1,"exchangeDbSource":3,"generation":6,"applicationDiscovery":0,"discoveryLifeTime":0,"fastBackup":1,"optimizedBackup":0,"clientListType":0,"selectListType":0,"appConsistent":1,"key":null,"res":"STU_NAME","pool":"NetBackup","foe":0,"shareGroup":"*ANY*","dataClassification":null,"hypervServer":null,"names":null,"bcmd":null,"rcmd":null,"applicationDefined":null,"oraBkupDataFileArgs":null,"oraBkupArchLogArgs":null,"include":"ALL_LOCAL_DRIVES","clients":[{"name":"client.test","architecture":"Linux","os":"RedHat2.6.32","field1":0,"field2":0,"field3":0,"field4":null},{"name":"client1.test","architecture":"Linux","os":"RedHat2.6.32","field1":0,"field2":0,"field3":0,"field4":null}],"schedules":[{"name":"full","backupType":0,"multiplexingCopies":1,"frequency":604800,"retentionLevel":0,"reserved1":0,"reserved2":0,"reserved3":0,"alternateReadServer":null,"maxFragmentSize":0,"calendar":0,"copies":0,"foe":0,"synthetic":0,"pfiFastRecover":0,"priority":-1,"storageService":1,"checksumDetection":0,"calDates":null,"calRetries":null,"calDayOfWeek":null,"calEDayOfWeek":null,"win_sun_start":0,"win_sun_duration":0,"win_mon_start":0,"win_mon_duration":0,"win_tue_start":0,"win_tue_duration":0,"win_wed_start":0,"win_wed_duration":0,"win_thu_start":0,"win_thu_duration":0,"win_fri_start":79200,"win_fri_duration":14400,"win_sat_start":0,"win_sat_duration":0,"schedRes":"RES_NAME","schedPool":null,"schedRL":0,"schedFoe":0,"schedSg":null,"_":{"backupType":"Full","frequency":"7 days","retentionLevel":0,"win_sun_start":"Any","win_sun_duration":"Any","win_mon_start":"Any","win_mon_duration":"Any","win_tue_start":"Any","win_tue_duration":"Any","win_wed_start":"Any","win_wed_duration":"Any","win_thu_start":"Any","win_thu_duration":"Any","win_fri_start":"22:00:00","win_fri_duration":"4 hours","win_sat_start":"Any","win_sat_duration":"Any","calDates":null,"calDayOfWeek":null,"calEDayOfWeek":null}},{"name":"full_forced","backupType":0,"multiplexingCopies":1,"frequency":604800,"retentionLevel":0,"reserved1":0,"reserved2":0,"reserved3":0,"alternateReadServer":null,"maxFragmentSize":0,"calendar":1,"copies":0,"foe":0,"synthetic":0,"pfiFastRecover":0,"priority":-1,"storageService":1,"checksumDetection":1,"calDates":null,"calRetries":null,"calDayOfWeek":"6,5","calEDayOfWeek":null,"win_sun_start":0,"win_sun_duration":0,"win_mon_start":0,"win_mon_duration":0,"win_tue_start":0,"win_tue_duration":0,"win_wed_start":0,"win_wed_duration":0,"win_thu_start":0,"win_thu_duration":0,"win_fri_start":79200,"win_fri_duration":14400,"win_sat_start":0,"win_sat_duration":0,"schedRes":"RES_NAME","schedPool":null,"schedRL":0,"schedFoe":0,"schedSg":null,"_":{"backupType":"Full","frequency":"7 days","retentionLevel":0,"win_sun_start":"Any","win_sun_duration":"Any","win_mon_start":"Any","win_mon_duration":"Any","win_tue_start":"Any","win_tue_duration":"Any","win_wed_start":"Any","win_wed_duration":"Any","win_thu_start":"Any","win_thu_duration":"Any","win_fri_start":"22:00:00","win_fri_duration":"4 hours","win_sat_start":"Any","win_sat_duration":"Any","calDates":null,"calDayOfWeek":"Friday of last week","calEDayOfWeek":null}},{"name":"incr","backupType":4,"multiplexingCopies":1,"frequency":86400,"retentionLevel":0,"reserved1":0,"reserved2":0,"reserved3":0,"alternateReadServer":null,"maxFragmentSize":0,"calendar":0,"copies":0,"foe":0,"synthetic":0,"pfiFastRecover":0,"priority":-1,"storageService":1,"checksumDetection":0,"calDates":null,"calRetries":null,"calDayOfWeek":null,"calEDayOfWeek":null,"win_sun_start":79200,"win_sun_duration":14400,"win_mon_start":79200,"win_mon_duration":14400,"win_tue_start":79200,"win_tue_duration":14400,"win_wed_start":79200,"win_wed_duration":14400,"win_thu_start":79200,"win_thu_duration":14400,"win_fri_start":0,"win_fri_duration":0,"win_sat_start":79200,"win_sat_duration":14400,"schedRes":"RES1_NAME","schedPool":null,"schedRL":0,"schedFoe":0,"schedSg":null,"_":{"backupType":"Cummulative","frequency":"24 hours","retentionLevel":0,"win_sun_start":"22:00:00","win_sun_duration":"4 hours","win_mon_start":"22:00:00","win_mon_duration":"4 hours","win_tue_start":"22:00:00","win_tue_duration":"4 hours","win_wed_start":"22:00:00","win_wed_duration":"4 hours","win_thu_start":"22:00:00","win_thu_duration":"4 hours","win_fri_start":"Any","win_fri_duration":"Any","win_sat_start":"22:00:00","win_sat_duration":"4 hours","calDates":null,"calDayOfWeek":null,"calEDayOfWeek":null}}],"_":{"policyType":"UX","jobSubtype":"Immediate"}}`;

describe('BPPLLIST', () => {
  describe('Policies', () => {
    it('should parse Policies object', () => {
      const parser = Parser(Policies);
      const result = parser(POLICIES_TEXT);
      expect(result).toEqual(JSON.parse(POLICIES_RESULT));
    });
  });
});
