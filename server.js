const path = require('path');
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const ErrorResponse = require('./utils/errorResponse');
const postController = require('./controllers/posts');

const PORT = process.env.PORT || 5000;

const app = express();

// Body parser
// app.use(express.json('*/json'));
app.use(
  express.json({
    type: function () {
      return true;
    },
    // type: 'json'
  })
);
// Enable CORS
app.use(cors());

app.get('/real', (req, res, next) => {
  return next(new ErrorResponse('it worked', 400));
});

app.post('/validate-rule', postController);

// @desc      Get User
// @route     GET baseUrl/
// @access    Public
app.get('/', (req, res) => {
  const message = 'My Rule-Validation API';
  const data = {
    name: 'Joye Shonubi',
    github: '@oladunjoye',
    email: 'shonubij@gmail.com',
    mobile: '08159614339',
    twitter: '@Oladunjoye_',
  };

  res.json({ message, status: 'success', data });
});

app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server running in development mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
