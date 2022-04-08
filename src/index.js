const path = require('path');
const Cached = require('../lib/cached.js');
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
const { ClientConfig } = require('./commands/bpgetconfig.js');

const CACHE_AGE = {
  clients: 1000 * 60 * 1,
  jobs: 1000 * 1,
  policies: 1000 * 60 * 1,
  retentionLevels: 1000 * 60 * 1,
  services: 1000 * 1,
  slps: 1000 * 1,
  summary: 1000 * 1,
  version: 1000 * 60 * 1,
  whoami: 1000 * 1,
};

let NBUCLI;

class NbuCli {
  constructor({ bin = './', age = {} } = {}) {
    this.bin = bin;
    this.masterServer = null;
    this.cached = Cached.depot('NbuCli');
    this.age = { ...CACHE_AGE, ...age };
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
    return this.cached.set(
      'clients',
      () => this.#get(Clients),
      this.age.clients
    );
  }
  async config({ client } = {}) {
    const args = [client || this.masterServer];
    return this.cached.set(
      'config',
      () => this.#get(ClientConfig, { args }),
      this.age.config
    );
  }
  async isLoggedIn({ domain, user, type }) {
    await this.whoami();
    return isLoggedIn({ domain, user, type });
  }
  async isRunning(params) {
    await this.services();
    return isRunning(params);
  }
  async jobs({ daysBack } = {}) {
    await this.retentionLevels();
    const args = [];
    if (daysBack) args.push('-t', NBUDateTime(-daysBack * 24 * 60 * 60 * 1000));
    return this.cached.set(
      'jobs',
      () => this.#get(Jobs, { args }),
      this.age.jobs
    );
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
    return this.cached.set(
      'policies',
      () => this.#get(Policies),
      this.age.policies
    );
  }
  async retentionLevels() {
    return this.cached.set(
      'retentionLevels',
      () => this.#get(RetentionLevels),
      this.age.retentionLevels
    );
  }
  async services() {
    return this.cached.set(
      'services',
      () => this.#get(Services),
      this.age.services
    );
  }
  async slps() {
    await this.retentionLevels();
    return this.cached.set('slps', () => this.#get(SLPs), this.age.slps);
  }
  async summary() {
    return this.cached.set(
      'summary',
      () => this.#get(Summary),
      this.age.summary
    );
  }
  async whoami() {
    return this.cached.set('whoami', () => this.#get(Whoami), this.age.whoami);
  }
}

module.exports = async ({ bin, credentials, age } = {}) => {
  if (!NBUCLI) {
    const nbu = new NbuCli({ bin, age });
    if (credentials) await nbu.login(credentials);
    const [{ masterServer }] = await nbu.summary();
    if (!masterServer) throw new Error(`Unable to read NBU CLI in ${bin}`);
    nbu.masterServer = masterServer;
    NBUCLI = nbu;
  }
  return NBUCLI;
};
