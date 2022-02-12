"use strict";
exports.__esModule = true;
var express_1 = require("express");
var debug_1 = require("debug");
var debugServer = (0, debug_1["default"])('server');
var app = (0, express_1["default"])();
app.use(express_1["default"].json);
app.use(express_1["default"].urlencoded({
    extended: true
}));
app.get('/', function (req, res, next) {
    debugServer(req.body);
    res.send({ text: "Hello World!" });
});
exports["default"] = app;
