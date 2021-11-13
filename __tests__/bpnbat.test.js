const { Parser } = require('../lib/parsedFileOutput');
const { Login, Logout, Whoami } = require('../src/commands/bpnbat.js');

const LOGIN_TEXT = `Operation completed successfully.`;
const LOGIN_RESULT = `{"output":"Operation completed successfully."}`;
const WHOAMI_TEXT = `Web login details:
------------------
Name: johndoe
Domain: ACME
Issued by: masterServer
Expiry Date: Nov 10 07:09:31 2021 GMT
Authentication method: Microsoft Windows 
Operation completed successfully.`;
const WHOAMI_RESULT = `{"type":"Web","name":"johndoe","domain":"ACME","issuer":"masterServer","expiration":"Nov 10 07:09:31 2021 GMT","method":"Microsoft Windows"}`;

describe('BPNBAT', () => {
  describe('Login', () => {
    it('should parse Login object', () => {
      const parser = Parser(Login);
      const result = parser(LOGIN_TEXT);
      expect(result).toEqual(JSON.parse(LOGIN_RESULT));
    });
  });
  describe('Logout', () => {
    it('should parse Logout object', () => {
      const parser = Parser(Logout);
      const result = parser(LOGIN_TEXT);
      expect(result).toEqual(JSON.parse(LOGIN_RESULT));
    });
  });
  describe('Whoami', () => {
    it('should parse Whoami object', () => {
      const parser = Parser(Whoami);
      const result = parser(WHOAMI_TEXT);
      expect(result).toEqual(JSON.parse(WHOAMI_RESULT));
    });
  });
});
