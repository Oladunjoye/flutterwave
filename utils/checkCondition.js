const checkCondition = (condition, check, data) => {
  let result = false;
  let value = data;
  switch (condition) {
    case 'eq':
      result = value === check;
      break;
    case 'neq':
      //
      result = value !== check;
      break;
    case 'gt':
      //
      result = value > check;

      break;
    case 'gte':
      result = value >= check;
      //
      break;

    case 'contains':
      result = value.includes(check);
      //
      break;
  }
  return result;
};

module.exports = checkCondition;
