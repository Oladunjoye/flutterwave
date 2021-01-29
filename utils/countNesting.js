const util = require('util');
function countNesting(object) {
  const level =
    JSON.stringify(object)
      .replace(/(["'])((?:(?=(?:(\\))*)\3.|.)*?)\1/g, '')
      .match(/^((?:\{[^}]*)+)/)[1]
      .split('{').length - 1;

  return level;
}

module.exports = countNesting;
