const { Parser } = require('../lib/parsedFileOutput');
const { Clients } = require('../src/commands/bpplclients.js');
const { value } = require('../src/helpers');

const CLIENTS_TEXT = `CLIENT client.test Windows-x64 Windows2012_R2 *NULL* 0 0 0`;
const CLIENTS_RESULT = `{"name":"client.test","architecture":"Windows-x64","os":"Windows2012_R2","priority":null,"u1":0,"u2":0,"u3":0}`;

describe('BPPLCLIENTS', () => {
  describe('Clients', () => {
    it('should parse Clients object', () => {
      Clients.cast = value.cast;
      const parser = Parser(Clients);
      const result = parser(CLIENTS_TEXT);
      expect(result).toEqual(JSON.parse(CLIENTS_RESULT));
    });
  });
});
