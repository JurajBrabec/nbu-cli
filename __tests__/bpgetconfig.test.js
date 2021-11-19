const { Parser } = require('../lib/parsedFileOutput');
const { ClientConfig } = require('../src/commands/bpgetconfig.js');
const { value } = require('../src/helpers');

const CLIENTCONFIG_TEXT = `Master;PC-x64, WindowsXP;9.1.0;NetBackup;9.1;910000;C:/Program Files/Veritas/NetBackup/bin;Windows2016 10 ;`;
const CLIENTCONFIG_RESULT = `{"clientMaster":"Master","platform":"PC-x64, WindowsXP","protocolLevel":"9.1.0","product":"NetBackup","versionName":"9.1","versionNumber":910000,"installationPath":"C:/Program Files/Veritas/NetBackup/bin","os":"Windows2016 10"}`;

describe('BPGETCONFIG', () => {
  describe('ClientConfig', () => {
    it('should parse ClientConfig object', () => {
      ClientConfig.cast = value.cast;
      const parser = Parser(ClientConfig);
      const result = parser(CLIENTCONFIG_TEXT);
      expect(result).toEqual(JSON.parse(CLIENTCONFIG_RESULT));
    });
  });
});
