"use strict";
exports.__esModule = true;
var express_1 = require("express");
var morgan_1 = require("morgan");
var helmet_1 = require("helmet");
var init_mongodb_1 = require("./dbs/init.mongodb");
var dotenv_1 = require("dotenv");
var app = express_1["default"]();
//config middleware
app.use(express_1["default"].json());
app.use(morgan_1["default"]("dev"));
app.use(helmet_1["default"]());
dotenv_1["default"].config();
//connect to database
init_mongodb_1["default"];
//config routes
app.get("/", function (req, res) {
    res.status(200).json({
        message: "Hello World"
    });
});
exports["default"] = app;
