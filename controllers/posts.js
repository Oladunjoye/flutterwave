const ErrorResponse = require('../utils/errorResponse');
const fieldNesting = require('../utils/fieldNesting');
const checkCondition = require('../utils/checkCondition');

const handlePosts = async (req, res, next) => {
  const { rule, data } = req.body;
  const conditions = ['eq', 'neq', 'gt', 'gte', 'contains'];
  const dataField = ['object', 'string', 'array'];

  // check if required fields are present
  if (!rule) return next(new ErrorResponse('rule is required.', 400));
  if (!data) return next(new ErrorResponse('data is required.', 400));

  //check if data field has valid data structure
  if (!dataField.includes(typeof data)) {
    return next(
      new ErrorResponse('data should be an object, string or array.', 400)
    );
  }

  // check if rule is valid json object
  if (!(typeof rule === 'object')) {
    return next(new ErrorResponse('rule should be an object.', 400));
  }

  //check if rule contains valid fields
  if (!rule.field) {
    return next(new ErrorResponse('field is missing from rule.', 400));
  }
  if (!rule.condition) {
    return next(new ErrorResponse('condition is missing from rule.', 400));
  }
  if (!rule.condition_value) {
    return next(
      new ErrorResponse('condition_value is missing from rule.', 400)
    );
  }
  //check if rule.field is valid
  const { targetField, error } = fieldNesting(rule, data);

  if (error) return next(new ErrorResponse(error, 400));
  if (!targetField) {
    return next(
      new ErrorResponse(`field ${rule.field} is missing from data.`, 400)
    );
  }

  //validate rule.condition
  if (!conditions.includes(rule.condition)) {
    return next(new ErrorResponse('invalid condition rule.', 400));
  }

  //check rule condition
  if (checkCondition(rule.condition, rule.condition_value, targetField)) {
    res.json({
      message: `field ${rule.field} successfully validated.`,
      status: 'success',
      data: {
        validation: {
          error: false,
          field: rule.field,
          field_value: targetField,
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  } else {
    res.status(400).json({
      message: `field ${rule.field} failed validation.`,
      status: 'error',
      data: {
        validation: {
          error: true,
          field: rule.field,
          field_value: targetField,
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  }
};

module.exports = handlePosts;
