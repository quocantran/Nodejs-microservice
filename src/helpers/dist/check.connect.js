"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
// count connect
var countConnect = function () {
    var numberConnection = mongoose_1["default"].connections.length;
    console.log("Number of connections: " + numberConnection);
};
