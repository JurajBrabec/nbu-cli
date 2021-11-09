const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

module.exports.NBUDateTime = (
  value = Date.now(),
  locale = 'en-US',
  hour12 = false
) =>
  new Date(value <= 0 ? Date.now() + value : value)
    .toLocaleString(locale, { hour12 })
    .replace(',', '');

module.exports.ISODateTime = (value = Date.now()) =>
  new Date(value - timezoneOffset)
    .toISOString()
    .split('.')
    .shift()
    .replace('T', ' ');

module.exports.secondsToTime = (seconds) => {
  if (seconds === 0) return 'Any';
  const d = new Date(0);
  d.setSeconds(seconds);
  return d.toISOString().substr(11, 8);
};

module.exports.secondsToText = (seconds) => {
  if (seconds === 0) return 'Any';
  const hours = Math.floor(seconds / 60 / 60);
  if (hours <= 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  return `${days} days`;
};
