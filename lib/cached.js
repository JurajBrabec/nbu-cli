const CACHE = new Map();

module.exports.set = (name, func, maxAge = 1 * 1000) => {
  const timeStamp = Date.now();
  if (!CACHE.has(name) || timeStamp >= CACHE.get(name).timeStamp + maxAge) {
    CACHE.set(name, { timeStamp, data: func() });
  }
  return CACHE.get(name).data;
};

module.exports.get = (name) => CACHE.get(name)?.data;
module.exports.has = (name) => CACHE.has(name);
