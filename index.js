'use strict';

/**
 * @example
 *
 * http.createServerAsync()
 *   .listen(8000)
 *   .tap(function (server) {
 *          console.log(server.address());
 *      })
 *   .delay(5000)
 *   .close()
 *   .then(console.log)
 *   .catch(console.error);
 *
 */

var util = require('util')
  , http = require('http')
  , BluebirdPromise = require('bluebird/js/main/promise')()
  , slice = Array.prototype.slice;

function defaultHandler(resolve, reject) {
  return function (error) {
    if (error) {
      reject(error);
      return;
    }
    this.removeListener('error', reject);
    resolve(this);
  };
}

function ServerPromisified(requestListener) {
  return http.Server.call(this, requestListener);
}

util.inherits(ServerPromisified, http.Server);

ServerPromisified.prototype.listenAsync = function (path) {
  var httpServer = this;
  return new BluebirdPromise(function (resolve, reject) {
    if (httpServer instanceof http.Server === false) {
      reject(new Error('Server not initialized'));
    }
    httpServer
      .once('error', reject)
      .listen(path, defaultHandler(resolve, reject));
  });
};

ServerPromisified.prototype.closeAsync = function () {
  var httpServer = this;
  return new BluebirdPromise(function (resolve, reject) {

    // Hack for Node v0.10.x which was returning
    // Error: Not running when server was not running
    // or close() has been called more than once.
    if (httpServer._closed === true) {
      resolve(httpServer);
      return;
    }

    httpServer
      .once('error', reject)
      .once('close', defaultHandler(resolve, reject))
      .once('close', function () {
        httpServer._closed = true;
      });

    try {
      httpServer.close();
    } catch (err) {
      reject(err);
    }
  });
};

http.createServerAsync = function (requestListener) {
  return new BluebirdPromise(function (resolve, reject) {
    try {
      resolve(new ServerPromisified(requestListener));
    } catch (error) {
      reject(error);
    }
  });
};

BluebirdPromise.prototype.listen = function () {
  var args = slice.call(arguments, 0);
  return this.then(function (server) {
    return server.listenAsync.apply(server, args);
  });
};

BluebirdPromise.prototype.close = function () {
  return this.then(function (server) {
    return server.closeAsync();
  });
};

http.ServerPromisified = ServerPromisified;
exports = module.exports = http;
