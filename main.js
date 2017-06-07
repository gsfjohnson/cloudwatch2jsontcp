#!/usr/bin/env node

/*jslint node: true */
/*jslint indent: 2 */
'use strict';

const net = require('net');

var msg = {
  "SourceModuleName": "nodejs",
  "SourceModuleType": "im_tcp",
  "SourceName": "cloudwatch2jsontcp",
  "Message": "Test message.",
  "Hostname": "home",
  "EventTime": "2017-06-06 21:32:40",
  "EventReceivedTime": "2017-06-06 21:32:40"
};


/**/

var AWS = require('aws-sdk'),
    http = require('http'),
    zlib = require('zlib');

// default configuration
var cfg = {
    host: 'syslog.example.com',
    port: 20514
};
// get addl config from environment
if (process.env.host) { cfg.host = process.env.host; }
if (process.env.port) { cfg.port = process.env.port; }

var cloudWatchLogs = new AWS.CloudWatchLogs({
    apiVersion: '2014-03-28'
});

// entry point
exports.handler = function (event, context) {
  var payload = new Buffer(event.awslogs.data, 'base64');

  zlib.gunzip(payload, function (error, result) {
    if (error) {
      context.fail(error);
    } else {
      var result_parsed = JSON.parse(result.toString('ascii'));
      var parsedEvents = result_parsed.logEvents.map(function(logEvent) {
          return parseEvent(logEvent, result_parsed.logGroup, result_parsed.logStream);
      });

      sendEvents(parsedEvents);
    }
  });

  // converts the event to a valid JSON object
  // with the sufficient infomation required
  function parseEvent(logEvent, logGroupName, logStreamName) {
    return {
      // remove '\n' character at the end of the event
      message: logEvent.message.substring(0, logEvent.message.length - 1),
      logGroupName: logGroupName,
      logStreamName: logStreamName,
      timestamp: new Date(logEvent.timestamp).toISOString()
    };
  }

  // joins all the events to a single event
  // and sends as json via tcp
  function sendEvents(parsedEvents) {

    // get all the events, stringify them and join them
    // with the new line character which can be sent
    var allevents = parsedEvents.map(JSON.stringify).join('\n');

    // create connection to send logs
    try {

      var nc = net.createConnection(cfg.host, cfg.port);
      //console.log('Socket created.');
      //s.on('data', function(data) {
        // Log the response from the HTTP server.
      //  console.log('RESPONSE: ' + data);
      //})
      nc.on('end', function() {
        //console.log('client closed');
        //context.succeed('all events are sent');
        context.done();
      });
      nc.on('error', function (e) {
          console.log('problem with request: ' + e.toString());
          context.fail(e);
      });
      nc.on('connect', function() {
        // write data to socket
        nc.write(allevents);
        nc.end();
      });

    } catch (ex) {
      console.log(ex.message);
      context.fail(ex.message);
    }
  }
};
