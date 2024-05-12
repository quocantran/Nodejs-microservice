"use strict";
exports.__esModule = true;
var dev = {
    app: {
        port: process.env.DEV_PORT
    },
    db: {
        url: process.env.MONGODB_URL
    }
};
var pro = {
    app: {
        port: process.env.PRO_PORT
    },
    db: {
        url: process.env.MONGODB_URL
    }
};
var config = { dev: dev, pro: pro };
var env = process.env.NODE_ENV || "dev";
exports["default"] = config[env];
