const NBU = require('./src');

const credentials = { domain: 'SEC', user: 'jbrabec', password: '*' };
async function main() {
  try {
    const nbu = await NBU({ bin: 'd:/veritas/netbackup/bin' });
    console.log(nbu.masterServer);
    let result;
    result = await nbu.config();
    console.log('Config', result);
    result = await nbu.clients();
    console.log('Client 1 /', result.length, result[0]);
    result = await nbu.jobs();
    console.log('Job 1 /', result.length, result[0]);
    result = await nbu.policies();
    console.log('Policy 1 /', result.length, result[0]);
    result = await nbu.retentionLevels();
    console.log('RetentionLevel 1 /', result.length, result[0]);
    result = await nbu.services();
    console.log('Service 1 /', result.length, result[0]);
    result = await nbu.slps();
    console.log('SLP 1 /', result.length, result[0]);
    result = await nbu.summary();
    console.log('Summary', result);

    result = await nbu.isLoggedIn(credentials);
    console.log('isloggedin:', result);
    result = await nbu.isRunning();
    console.log('isrunning:', result);
    result = await nbu.login(credentials);
    console.log('login:', result);
    result = await nbu.whoami();
    console.log('whoami:', result);
    result = await nbu.logout();
    console.log('logout:', result);
  } catch (error) {
    console.error(error);
  }
}

main();
