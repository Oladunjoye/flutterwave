const util = require('util');
function countNesting(object) {
  const level = 1;
  for (const key in object) {
    if (!object.hasOwnProperty(key)) continue;

    if (typeof object[key] == 'object') {
      const depth = util.depthOf(object[key]) + 1;
      level = Math.max(depth, level);
    }
  }
  return level;
}

module.exports = countNesting;
