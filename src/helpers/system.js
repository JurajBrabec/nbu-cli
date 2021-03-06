const { unlink, writeFile } = require('fs').promises;
const { tmpdir } = require('os');
const path = require('path');
const { platform } = require('process');
const { Logins, Services } = require('../maps');

const LOGIN_FILE = 'info.tmp';
const MASTER_REQUIRED_SERVICES = ['nbpem'];
const MEDIA_REQUIRED_SERVICES = ['nbrmms'];

module.exports.login = async ({
  domainType = 'WINDOWS',
  domain,
  user,
  password,
  func,
  command,
}) => {
  const file = path.join(tmpdir(), LOGIN_FILE);
  await writeFile(file, [domainType, domain, user, password].join('\n'));
  const args = ['-info', file];
  const result = await func(command, { args });
  await unlink(file);
  const { output } = result[0];
  if (!output.match(/success/))
    throw new Error(`User ${domain}\\${user} not logged in. ${output}`);
  return result;
};

module.exports.isLoggedIn = ({ domain, user, type = 'AT' } = {}) =>
  Logins.find(
    (login) =>
      login.type.toLowerCase() === type.toLowerCase() &&
      login.domain.toLowerCase() === domain.toLowerCase() &&
      login.name.toLowerCase() === user.toLowerCase()
  );

module.exports.isRunning = (params = {}) => {
  const started =
    MASTER_REQUIRED_SERVICES.every((service) => Services.has(service)) ||
    MEDIA_REQUIRED_SERVICES.every((service) => Services.has(service));
  if (!started && params.throw)
    throw new Error(
      `NBU is down (${MASTER_REQUIRED_SERVICES.join(
        ', '
      )} or ${MEDIA_REQUIRED_SERVICES.join(', ')} not running).`
    );
  return started;
};

module.exports.platformSpecific = (params, osParams) => {
  if (!osParams[platform])
    throw new Error(`Platform ${platform} not supported.`);
  return {
    ...params,
    ...osParams[platform],
  };
};
