const { Parser } = require('../lib/parsedFileOutput');
const { RetentionLevels } = require('../src/commands/bpretlevel.js');
const { value } = require('../src/helpers');

const RL_TEXT = `1         37      (3196800) 37 days`;
const RL_RESULT = `{"level":1,"days":37,"seconds":3196800,"period":"37 days"}`;

describe('BPPS', () => {
  describe('Services', () => {
    it('should parse Services object', () => {
      RetentionLevels.cast = value.cast;
      const parser = Parser(RetentionLevels);
      const result = parser(RL_TEXT);
      expect(result).toEqual(JSON.parse(RL_RESULT));
    });
  });
});
