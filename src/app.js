require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
require('./model')

require('./api/admin/admin.controller')(app)
require('./api/contracts/contracts.controller')(app)
require('./api/jobs/jobs.controller')(app)
require('./api/profile/profile.controller')(app)

module.exports = app;
