const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const isJson = require('../utils/isJson');
const countNesting = require('../utils/countNesting');

const handlePosts = async (req, res, next) => {
  const { rule, data } = req.body;

  // check if required fields are present
  if (!rule) return next(new ErrorResponse('rule is required', 400));
  if (!data) return next(new ErrorResponse('data is required', 400));

  // check if rule is valid json object
  if (!(typeof rule === 'object')) {
    return next(new ErrorResponse('Invalid JSON payload passed', 400));
  }

  // check if 'rule' ia within object nesting limit
  console.log(countNesting(rule));
  res.send(rule);
};

module.exports = handlePosts;
