require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const { requestLoggerMiddleware } = require("./src/middleware.js");

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const userRoutes = require('./routes/api.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Reference:
// https://stackoverflow.com/a/64546368/21951181
app.use(requestLoggerMiddleware({ logger: console.log }));

const requestLogger = (request, response, next) => {
  console.log(`${request.method} url:: ${request.url}`);
  console.log('body::')
  console.log(request.body);
  next()
}
app.use(requestLogger)

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
userRoutes(app);

// Ref site: https://reflectoring.io/express-error-handling/
// Error handling Middleware functions
const errorLogger = (error, request, response, next) => {
  console.log(`error ${error.message}`)
  next(error) // calling next middleware
}
app.use(errorLogger)
const errorResponder = (error, request, response, next) => {
  response.header("Content-Type", 'application/json')
  const status = error.status || 400
  response.status(status).send(error.message)
}
app.use(errorResponder)

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Start our server and tests!
app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
