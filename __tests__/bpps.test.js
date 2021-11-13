const { Parser } = require('../lib/parsedFileOutput');
const { Services } = require('../src/commands/bpps.js');

const SERVICES_TEXT = `bpdbm           12508    0.000%           10.812   40M  11/08/21 07:37:59.156`;
const SERVICES_RESULT = `{"name":"bpdbm","pid":"12508","load":"0.000%","time":"10.812","mem":"40M","startDate":"11/08/21","startTime":"07:37:59.156"}`;

describe('BPPS', () => {
  describe('Services', () => {
    it('should parse Services object', () => {
      const parser = Parser(Services);
      const result = parser(SERVICES_TEXT);
      expect(result).toEqual(JSON.parse(SERVICES_RESULT));
    });
  });
});
