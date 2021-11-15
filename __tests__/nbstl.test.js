const { Parser } = require('../lib/parsedFileOutput');
const { SLPs } = require('../src/commands/nbstl.js');
const { value } = require('../src/helpers');

const SLP_TEXT = `SLP_NAME *NULL* 0 0x0 0
0 STU1_NAME *NULL* *NULL* 0 1 *NULL* 0 0x0 0 0 *NULL* 1 Default_24x7_Window *NULL* *NULL*
    1 STU2_NAME *NULL* *NULL* 0 1 *NULL* 0 0x0 1 0 *NULL* 2 Default_24x7_Window *NULL* *NULL*`;
const SLP_RESULT = `[{"slpName":"SLP_NAME","dataClassification":null,"duplicationPriority":0,"state":"0x0","version":0,"useFor":0,"storageUnit":"STU1_NAME","volumePool":null,"mediaOwner":null,"retentionType":0,"retentionLevel":1,"alternateReadServer":null,"preserveMpx":0,"ddoState":"0x0","source":0,"unused":0,"operationId":null,"operationIndex":1,"slpWindow":"Default_24x7_Window","targetMaster":null,"targetMasterSlp":null,"_":{"useFor":"Backup","retentionLevel":1}},{"slpName":"SLP_NAME","dataClassification":null,"duplicationPriority":0,"state":"0x0","version":0,"useFor":1,"storageUnit":"STU2_NAME","volumePool":null,"mediaOwner":null,"retentionType":0,"retentionLevel":1,"alternateReadServer":null,"preserveMpx":0,"ddoState":"0x0","source":1,"unused":0,"operationId":null,"operationIndex":2,"slpWindow":"Default_24x7_Window","targetMaster":null,"targetMasterSlp":null,"_":{"useFor":"Duplication","retentionLevel":1}}]`;

describe('NBSTL', () => {
  describe('SLPs', () => {
    it('should parse SLPs object', () => {
      SLPs.cast = value.cast;
      const parser = Parser(SLPs);
      const result = parser(SLP_TEXT);
      expect(result).toEqual(JSON.parse(SLP_RESULT));
    });
  });
});
