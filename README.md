log4js-logstash-appender
========================
A simple log4js appender that sends a JSON-object to a Logstash server.


Where can I find the releases?
------------------------------
You can install it using npm. Exampel package.json file:

```js
{
  "dependencies": {
    "log4js": "0.6.22",
    "log4js-logstash-appender": "1.0.0"
  }
}
```


Usage (log4js configuration)
----------------------------
```js
{
  "appenders": [
    {
      "type": "log4js-logstash-appender",
      "host": "127.0.0.1",
      "port": 12345,
      "application": "MyApplication",
      "environment": "Production"
    }
  ]
}
```


How do I utilize MDC (Mapped Diagnostic Context)?
-------------------------------------------------
log4js-logstash-appender utilizes [continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage) to provide an MDC. It requires the MDC to be bound to a context or callback. Here is an example of how this is done using an express-application, where we bind the request and response event emitters to the MDC context:

```js
var express = require('express');
var uuid = require('uuid');
var MDC = require('log4js-logstash-appender').MDC;

var app = express();

app.use(function(req, res, next) {
	var requestId = uuid();
    req.requestId = requestId;

	MDC.bindEmitter(req);
	MDC.bindEmitter(res);
    
    MDC.run(function() {
    	MDC.set('requestId', requestId);
    });
});
```
