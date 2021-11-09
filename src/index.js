const path = require('path');
const cached = require('../lib/cached.js');
const { ParsedFileOutput, Parser } = require('../lib/parsedFileOutput');
const {
  NBUDateTime,
  login,
  isLoggedIn,
  isRunning,
  value,
} = require('./helpers');
const { Login, Logout, Whoami } = require('./commands/bpnbat.js');
const { Summary, Jobs } = require('./commands/bpdbjobs.js');
const { Clients } = require('./commands/bpplclients.js');
const { Policies } = require('./commands/bppllist.js');
const { RetentionLevels } = require('./commands/bpretlevel.js');
const { SLPs } = require('./commands/nbstl.js');
const { Services } = require('./commands/bpps.js');

const CACHE = {
  clients: 1000 * 60 * 1,
  jobs: 1000 * 1,
  policies: 1000 * 60 * 1,
  retentionLevels: 1000 * 60 * 1,
  services: 1000 * 1,
  slps: 1000 * 1,
  summary: 1000 * 1,
  whoami: 1000 * 1,
};

let NBUCLI;

class NbuCli {
  constructor({ bin = './' } = {}) {
    this.bin = bin;
    this.masterServer = null;
  }
  async #get(command, params = {}) {
    command.cast = value.cast;
    if (command !== Services) await this.isRunning({ throw: true });
    if (command.begin) await command.begin();
    const file = path.join(this.bin, command.bin);
    const { args = [], options, delimiter = /\r?\n/ } = command;
    const parser = Parser(command);
    const execute = ParsedFileOutput({
      file,
      args,
      options,
      delimiter,
      parser,
    });
    return execute(params.args).asArray();
  }
  async clients() {
    return cached.set('clients', () => this.#get(Clients), CACHE.clients);
  }
  async isLoggedIn({ domain, user, type }) {
    await this.whoami();
    return isLoggedIn({ domain, user, type });
  }
  async isRunning(params) {
    await this.services();
    return isRunning(params);
  }
  async jobs({ client, daysBack } = {}) {
    await this.retentionLevels();
    const args = [];
    if (client) args.push('-client', client);
    if (daysBack) args.push('-t', NBUDateTime(-daysBack * 24 * 60 * 60 * 1000));
    return cached.set('jobs', () => this.#get(Jobs, { args }), CACHE.jobs);
  }
  async login({ domainType = 'WINDOWS', domain, user, password } = {}) {
    await this.isRunning({ throw: true });
    const func = this.#get.bind(this);
    const command = Login;
    return login({ domainType, domain, user, password, func, command });
  }
  async logout() {
    return this.#get(Logout);
  }
  async policies() {
    await this.retentionLevels();
    return cached.set('policies', () => this.#get(Policies), CACHE.policies);
  }
  async retentionLevels() {
    return cached.set(
      'retentionLevels',
      () => this.#get(RetentionLevels),
      CACHE.retentionLevels
    );
  }
  async services() {
    return cached.set('services', () => this.#get(Services), CACHE.services);
  }
  async slps() {
    await this.retentionLevels();
    return cached.set('slps', () => this.#get(SLPs), CACHE.slps);
  }
  async summary() {
    return cached.set('summary', () => this.#get(Summary), CACHE.summary);
  }
  async whoami() {
    return cached.set('whoami', () => this.#get(Whoami), CACHE.whoami);
  }
}

module.exports = async ({ bin, credentials } = {}) => {
  if (!NBUCLI) {
    NBUCLI = new NbuCli({ bin });
    if (credentials) await NBUCLI.login(credentials);
    const [{ masterServer }] = await NBUCLI.summary();
    if (!masterServer) throw new Error(`Unable to read NBU CLI in ${bin}`);
    NBUCLI.masterServer = masterServer;
  }
  return NBUCLI;
};
