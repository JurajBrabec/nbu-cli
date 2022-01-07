const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

const Days = new Map([
  [1, 'Sunday'],
  [2, 'Monday'],
  [3, 'Tuesday'],
  [4, 'Wednesday'],
  [5, 'Thursday'],
  [6, 'Friday'],
  [7, 'Saturday'],
]);
const Weeks = new Map([
  [1, 'first'],
  [2, 'second'],
  [3, 'third'],
  [4, 'fourth'],
  [5, 'last'],
]);

module.exports.getCalDates = (calDates) => {
  if (typeof calDates !== 'string') return null;
  return calDates
    .split(',')
    .map((d) => exports.ISODateTime(d * 1000))
    .join(',');
};

module.exports.getCalDayOfWeek = (calDayOfWeek) => {
  if (typeof calDayOfWeek !== 'string') return null;
  return calDayOfWeek
    .split(';')
    .map((d) => {
      const [day, week] = d.split(',');
      return `${Days.get(+day)} of ${Weeks.get(+week)} week`;
    })
    .join(',');
};

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
