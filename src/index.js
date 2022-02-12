"use strict";
exports.__esModule = true;
/**
 * Module dependencies.
 */
var app_1 = require("./app");
var debug_1 = require("debug");
var http_1 = require("http");
var debugServer = (0, debug_1["default"])('server');
/**
 * Get port from environment and store in Express.
 */
var _port = normalizePort(process.env.PORT || '3000');
app_1["default"].set('port', _port);
/**
 * Create HTTP server.
 */
var server = http_1["default"].createServer(app_1["default"]);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(_port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof _port === 'string'
        ? 'Pipe ' + _port
        : 'Port ' + _port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            debugServer(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            debugServer(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address() || { port: null };
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debugServer('Listening on ' + bind);
}
