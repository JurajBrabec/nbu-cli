# `NBU-CLI` package

- [NBU](#nbu)

<a name="nbu"></a>

## `NBU` function

Returns the instance of NetBackup interface.

### Usage/Examples

import the package

```javascript
const NBU = require('nbu-cli');
```

instantiate a process with path to `bin` folder

```javascript
const nbu = await NBU({ bin: 'c:/program files/veritas/netbackup/bin' });
console.log(nbu.masterServer);
```

You can retrieve following results:

- [`isRunning`](#is-running)
- [`isLoggedIn`](#is-logged-in)
- [`login`](#login)
- [`whoami`](#who-am-i)
- [`logout`](#logout)

Configuration specific results:

- [`clients`](#clients)
- [`jobs`](#jobs)
- [`policies`](#policies)
- [`retentionLevels`](#retention-levels)
- [`slps`](#slps)
- [`summary`](#summary)

<a name="is-running"></a>

### The `isRunning` function

This function returns `true` or `false` depending on whether the required NetBackup services are running or not.

```javascript
if (await nbu.isRunning()) console.log('You can safely read the data.');
```

<a name="is-logged-in"></a>

### The `isLoggedIn` function

This function returns `true` or `false` depending on whether the specified user is logged in or not.

```javascript
if (await nbu.isLoggedIn({ domain: 'ACME', user: 'john' }))
  console.log('Welcome, John');
```

<a name="login"></a>

### The `login` function

This function logs the specified user in.

```javascript
const result = await nbu.login({ domain: 'ACME', user: 'john' });
```

<a name="logout"></a>

### The `logout` function

This function logs the current user out.

```javascript
const result = await nbu.logout();
```

<a name="clients"></a>

### The `clients` function

This function returns all configured clients.

```javascript
const clients = await nbu.clients();
```

<a name="jobs"></a>

### The `jobs` function

This function returns all jobs.

```javascript
const result = await nbu.jobs();
```

Or just jobs for last `daysBack` days.

```javascript
const result = await nbu.jobs({ daysBack: 3 });
```

<a name="policies"></a>

### The `policies` function

This function returns all configured policies.

```javascript
const result = await nbu.policies();
```

<a name="retentionLevels"></a>

### The `retentionLevels` function

This function returns all configured policies.

```javascript
const result = await nbu.retentionLevels();
```

<a name="services"></a>

### The `services` function

This function returns all NetBackup realted services.

```javascript
const result = await nbu.services();
```

<a name="slps"></a>

### The `slps` function

This function returns all configured SLP's.

```javascript
const result = await nbu.slps();
```

<a name="summary"></a>

### The `summary` function

This function returns the summary.

```javascript
const result = await nbu.summary();
```
