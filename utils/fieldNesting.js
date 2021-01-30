const countNesting = require('./countNesting');

const fieldNesting = (rule, data) => {
  const inner = rule.field;
  const response = {
    status: false,
  };

  if (inner === '0') {
    response['targetField'] = data;
    return response;
  }
  const checkInner = (inner) => {
    const innerLength = inner.split('.');

    if (innerLength.length > 3) {
      response['error'] = 'rule field exceeds nesting limit.';
      return response;
    }

    let level1 = innerLength[0];
    const dataObject = typeof data[level1] === 'object';

    if (!dataObject) {
      if (innerLength.length > 1) {
        response['error'] = `field ${inner} is missing from data .`;
      }
      response['targetField'] = data[level1];
      return response;
    }

    if (innerLength.length - 1 > countNesting(data[level1])) {
      return false;
    }
    let level2 = innerLength[1];
    let level3 = innerLength[2];
    let result;

    if (level1) {
      result = data[level1];
    }
    if (level2) {
      result = result[level2];
    }
    if (level3) {
      result = result[level3];
    }

    response['targetField'] = result;

    return response;
  };

  return checkInner(inner);
};

module.exports = fieldNesting;
