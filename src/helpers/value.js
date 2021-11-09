const { ISODateTime, secondsToTime } = require('./dateTime');

const isNull = (value) =>
  value === '*NULL*' || value === '' || value === undefined || value === null;

const cast = (string, { type, maxLength } = {}) => {
  if (isNull(string)) return null;
  let result = string;
  switch (type) {
    case 'date':
      result = value.date(string);
      break;
    case 'number':
      result = value.number(string);
      break;
    case 'float':
      result = value.float(string);
      break;
    case 'string':
      result = value.string(string, maxLength);
      break;
    case 'time':
      result = value.time(string);
      break;
  }
  return result;
};

const value = {
  cast,
  date: (value) =>
    value === 0 || isNull(value) ? null : ISODateTime(value * 1000),
  float: (value) => (isNull(value) ? null : parseFloat(value)),
  map: (value, map) => map.get(value) || value,
  number: (value) => (isNull(value) ? null : parseInt(value)),
  string: (value, maxLength) =>
    isNull(value) ? null : value.slice(0, maxLength),
  time: (value) => (value === 0 || isNull(value) ? null : secondsToTime(value)),
};

module.exports = { cast, isNull, value };
