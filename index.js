"use strict"

var layout = require('log4js').layouts.messagePassThroughLayout;
var dgram = require('dgram');
var util = require('util');
var storage = require('continuation-local-storage');
var MDC = storage.createNamespace('log4js-MDC');

/** Sends data to logstash. */
function send(socket, host, port, loggingObject)
{
	var buffer = new Buffer(JSON.stringify(loggingObject));
	socket.send(buffer, 0, buffer.length, port, host, function(err, bytes)
	{
		if (err)
		{
			console.error('log4js-logstash-appender (%s:%p) - %s', host, port, util.inspect(err));
		}
	});
}

/** Returns the appender. */
function appender(configuration)
{
	var socket = dgram.createSocket('udp4');

	return function(loggingEvent)
	{
		var loggingObject =
		{
			name: loggingEvent.categoryName,
			message: layout(loggingEvent),
			severity: loggingEvent.level.level,
			severityText: loggingEvent.level.levelStr,
		};

		if (configuration.application)
		{
			loggingObject.application = configuration.application;
		}

		if (configuration.environment)
		{
			loggingObject.environment = configuration.environment;
		}

		console.log(MDC);

		if (MDC && MDC.active)
		{
			Object.keys(MDC.active).forEach(function(key)
			{
				loggingObject[key] = MDC.active[key];
			});
		}

		send(socket, configuration.host, configuration.port, loggingObject);
	};
}

/** Configures the logstash appender. */
function configure(configuration)
{
	return appender(configuration);
};

exports.appender = appender;
exports.configure = configure;
exports.MDC = MDC;