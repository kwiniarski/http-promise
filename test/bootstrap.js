'use strict';

var chai = require('chai');
var blanket = require('blanket');

process.env.multi = 'spec=- mocha-text-cov=- mocha-lcov-reporter=coverage.lcov';

blanket();

chai.use(require('chai-http'));
chai.request.addPromises(require('bluebird'));
chai.config.includeStack = true;

global.expect = chai.expect;
global.request = chai.request;

