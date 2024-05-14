"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose_1["default"].Schema({
    user: {
        required: true,
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: "User"
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        "default": []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, { timestamps: true });
var KeyTokenModel = mongoose_1["default"].model("KeyToken", keyTokenSchema);
//Export the model
exports["default"] = KeyTokenModel;
