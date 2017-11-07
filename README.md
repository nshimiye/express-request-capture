# Express Request Capture

Node.js express middleware for capturing HTTP requests and responses

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/nshimiye/express-request-capture.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/nshimiye/express-request-capture.svg)](https://travis-ci.org/nshimiye/express-request-capture)
[![codecov](https://codecov.io/gh/nshimiye/express-request-capture/branch/master/graph/badge.svg)](https://codecov.io/gh/nshimiye/express-request-capture)
[![Dev Dependencies](https://david-dm.org/nshimiye/express-request-capture/dev-status.svg)](https://david-dm.org/nshimiye/express-request-capture?type=dev)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/nshimiyetech)

### API

```js
var requestCapture = require ('@clearonline/express-request-capture')
```

* requestCapture ({ channel: string, url?: string })

When using this module with express or connect, simply `app.use` the module.
Request information `url, request, response, status, latency, and clientIp`, is printed/stored to the specified channel!
```js
var requestCapture = require ('express-request-capture'),
    express = require ('express')

var app = express()

var printAdapter = { channel: 'console|http|mongo|mysql', url: 'required if channel is either http or database' };
app.use(requestCapture(printAdapter))
```

```js
// sample response
{
    url: "https://alert.clearonline.org/api/v1/subscribe",
    method: "POST",
    status: 200,
    latency: 100,
    request: {
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            email: "hello@clearonline.org",
            trigger: "solar energy"
        },
        host: "localhost:3000",
        clientIp: "192.111.1.1"
    },
    response: {
        header: {
            "Date": "2017-06-02T22:29:44.315Z"
        },
        body: {
            message: "Thank you for subscribing, i will send you notes every monday!"
        }
    }
}
```

### Examples

### Packaging
* use of `jsnext:main`:  https://github.com/jsforum/jsforum/issues/5

### Resource
* [Using Superset for acceptence testing](http://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/)
