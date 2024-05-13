"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var apiKeySchema = new mongoose_1["default"].Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        "enum": ["active", "inactive"],
        "default": "active"
    },
    permissions: {
        type: [String],
        required: true,
        "enum": ["0000", "1111", "2222"]
    }
}, { timestamps: true });
var ApiKey = mongoose_1["default"].model("ApiKey", apiKeySchema);
exports["default"] = ApiKey;
