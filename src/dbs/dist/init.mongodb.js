"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
// Singleton class
var Database = /** @class */ (function () {
    function Database() {
        this.connect();
    }
    Database.prototype.connect = function (type) {
        if (type === void 0) { type = "mongodb"; }
        mongoose_1["default"]
            .connect("mongodb+srv://quocan142536:Ta123456@cluster0.emuywiy.mongodb.net/nestjs-basic?retryWrites=true&w=majority", {
            maxPoolSize: 50
        })
            .then(function () {
            console.log("Database connection successful");
        })["catch"](function (error) {
            console.error("Database connection error: ", error);
        });
    };
    Database.getInstance = function () {
        if (!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    };
    return Database;
}());
var instanceMongodb = Database.getInstance();
exports["default"] = instanceMongodb;
