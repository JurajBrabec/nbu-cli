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
const {
  Clients,
  ClientRemoveFromPolicy,
} = require('./commands/bpplclients.js');
const { Policies } = require('./commands/bppllist.js');
const { PolicyRemove } = require('./commands/bppldelete.js');
const { RetentionLevels } = require('./commands/bpretlevel.js');
const { SLPs } = require('./commands/nbstl.js');
const { Services } = require('./commands/bpps.js');
const { ClientConfig } = require('./commands/bpgetconfig.js');
const {
  ClientStatus,
  ClientOffline,
  ClientOnline,
} = require('./commands/bpclient.js');

const CACHE_AGE = {
  clients: 1000 * 60 * 1,
  config: 1000 * 60 * 60,
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
  async clientStatus({ client }) {
    const args = [client];
    return this.#get(ClientStatus, { args });
  }
  async clientOffline({ client }) {
    const args = [client];
    await this.#get(ClientOffline, { args });
    return this.clientStatus({ client });
  }
  async clientOnline({ client }) {
    const args = [client];
    await this.#get(ClientOnline, { args });
    return this.clientStatus({ client });
  }
  async clients({ age } = {}) {
    return this.cached.set(
      'clients',
      () => this.#get(Clients),
      age || this.age.clients
    );
  }
  async config({ client, age } = {}) {
    const host = client || this.masterServer;
    const args = [host];
    return this.cached.set(
      `config-${host}`,
      () => this.#get(ClientConfig, { args }),
      age || this.age.config
    );
  }
  async clientRemoveFromPolicy({ client, policy } = {}) {
    await this.#get(ClientRemoveFromPolicy, {
      args: [policy, '-delete', client],
    });
    const policies = await this.policies({ age: -1 });
    const result = {};
    const clientPolicies = policies.filter(({ clients }) =>
      clients.find(({ name }) => name === client)
    );
    result.policies = clientPolicies.length;
    const { clients } = policies.find(({ name }) => name === policy) || {};
    if (!clients) {
      result.error = 'Policy not found';
      return result;
    }
    result.clients = clients.length;
    if (clients.find(({ name }) => name === client)) {
      result.error = 'Client not removed';
      return result;
    }
    result.success = true;
    return result;
  }
  async isLoggedIn({ domain, user, type }) {
    await this.whoami();
    return isLoggedIn({ domain, user, type });
  }
  async isRunning(params) {
    await this.services();
    return isRunning(params);
  }
  async jobs({ daysBack, age } = {}) {
    await this.retentionLevels();
    const args = [];
    if (daysBack) args.push('-t', NBUDateTime(-daysBack * 24 * 60 * 60 * 1000));
    return this.cached.set(
      `jobs-${daysBack || 'all'}`,
      () => this.#get(Jobs, { args }),
      age || this.age.jobs
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
  async policies({ age } = {}) {
    await this.retentionLevels();
    return this.cached.set(
      'policies',
      () => this.#get(Policies),
      age || this.age.policies
    );
  }
  async policyRemove({ policy } = {}) {
    await this.#get(PolicyRemove, {
      args: [policy],
    });
    const policies = await this.policies({ age: -1 });
    const result = policies.find(({ name }) => name === policy);
    if (result) return { error: 'Policy not removed' };
    return { success: true };
  }
  async retentionLevels({ age } = {}) {
    return this.cached.set(
      'retentionLevels',
      () => this.#get(RetentionLevels),
      age || this.age.retentionLevels
    );
  }
  async services({ age } = {}) {
    return this.cached.set(
      'services',
      () => this.#get(Services),
      age || this.age.services
    );
  }
  async slps({ age } = {}) {
    await this.retentionLevels();
    return this.cached.set('slps', () => this.#get(SLPs), age || this.age.slps);
  }
  async summary({ age } = {}) {
    return this.cached.set(
      'summary',
      () => this.#get(Summary),
      age || this.age.summary
    );
  }
  async whoami({ age } = {}) {
    return this.cached.set(
      'whoami',
      () => this.#get(Whoami),
      age || this.age.whoami
    );
  }
}

module.exports = async ({ bin, credentials, age } = {}) => {
  if (!NBUCLI) {
    const nbu = new NbuCli({ bin, age });
    if (credentials) await nbu.login(credentials);
    const summary = await nbu.summary();
    if (!summary.length || !summary[0].masterServer)
      throw new Error(`Unable to read NBU CLI in '${bin}'.`);
    nbu.masterServer = summary[0].masterServer;
    NBUCLI = nbu;
  }
  return NBUCLI;
};
