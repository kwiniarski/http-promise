'use strict';

var chai = require('chai');

process.env.multi = 'spec=- mocha-lcov-reporter=coverage.lcov';
require('blanket');

chai.use(require('chai-http'));
chai.request.addPromises(require('bluebird'));
chai.config.includeStack = true;

global.expect = chai.expect;
global.request = chai.request;

