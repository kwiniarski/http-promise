'use strict';

var chai = require('chai');

chai.use(require('chai-http'));
chai.request.addPromises(require('bluebird'));
chai.config.includeStack = true;

global.expect = chai.expect;
global.request = chai.request;
