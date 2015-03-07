# http-promise

Simple module that adds promisified version of Node's `http.Server`.

## Installation

```
npm install http-promise --save-dev
```

## Usage

To use promisified server, just create it with `createServerAsync()`.

```
var httpPromise = require('http-promise');

httpPromise.createServerAsync()
  .listen(8000)
  .tap(function (server) {
         console.log(server.address());
     })
  .delay(5000)
  .close()
  .then(console.log)
  .catch(console.error);
```

## API

Only two `http.Server` methods are promisified:

* `listen`
* `close`

Those methods act as usual, expect they return a promise.


