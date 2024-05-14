"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var shop_model_1 = require("../models/shop.model");
var bcrypt_1 = require("bcrypt");
var crypto_1 = require("crypto");
var keyToken_service_1 = require("./keyToken.service");
var authUtils_1 = require("../auth/authUtils");
var utils_1 = require("../utils");
var error_response_1 = require("../core/error.response");
var shop_service_1 = require("./shop.service");
var RoleShop = {
    SHOP: "SHOP",
    ADMIN: "ADMIN",
    EDITOR: "EDITOR",
    WRITER: "WRITER"
};
var AccessService = /** @class */ (function () {
    function AccessService() {
    }
    AccessService.register = function (shop) { return __awaiter(void 0, void 0, void 0, function () {
        var name, email, password, holderShop, hashPassword, newShop, _a, privateKey, publicKey, publicKeyString, tokens, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    name = shop.name, email = shop.email, password = shop.password;
                    return [4 /*yield*/, shop_model_1["default"].findOne({ email: email }).lean()];
                case 1:
                    holderShop = _b.sent();
                    if (holderShop) {
                        throw new error_response_1.BadRequestError("Email already exists");
                    }
                    return [4 /*yield*/, bcrypt_1["default"].hash(password, 10)];
                case 2:
                    hashPassword = _b.sent();
                    return [4 /*yield*/, shop_model_1["default"].create({
                            name: name,
                            email: email,
                            password: hashPassword,
                            roles: [RoleShop.SHOP]
                        })];
                case 3:
                    newShop = _b.sent();
                    if (!newShop) return [3 /*break*/, 6];
                    _a = crypto_1["default"].generateKeyPairSync("rsa", {
                        modulusLength: 4096,
                        publicKeyEncoding: {
                            type: "pkcs1",
                            format: "pem"
                        },
                        privateKeyEncoding: {
                            type: "pkcs1",
                            format: "pem"
                        }
                    }), privateKey = _a.privateKey, publicKey = _a.publicKey;
                    publicKeyString = publicKey.toString();
                    return [4 /*yield*/, authUtils_1.createTokenPair({ userId: newShop._id, email: email }, publicKeyString, privateKey)];
                case 4:
                    tokens = _b.sent();
                    data = {
                        userId: newShop._id,
                        privateKey: privateKey,
                        publicKey: publicKey,
                        refreshToken: tokens.refreshToken
                    };
                    return [4 /*yield*/, keyToken_service_1["default"].createKeyToken(data)];
                case 5:
                    _b.sent();
                    return [2 /*return*/, {
                            metadata: {
                                shop: utils_1.getInfoData({
                                    fileds: ["_id", "name", "email"],
                                    object: newShop
                                }),
                                tokens: tokens
                            }
                        }];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    AccessService.login = function (_a) {
        var email = _a.email, password = _a.password, _b = _a.refreshToken, refreshToken = _b === void 0 ? null : _b;
        return __awaiter(void 0, void 0, void 0, function () {
            var shop, match, _c, privateKey, publicKey, publicKeyString, tokens, data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, shop_service_1.findByEmail({ email: email })];
                    case 1:
                        shop = _d.sent();
                        if (!shop) {
                            throw new error_response_1.UnauthorizedError("Shop not found", 401);
                        }
                        return [4 /*yield*/, bcrypt_1["default"].compare(password, shop.password)];
                    case 2:
                        match = _d.sent();
                        if (!match) {
                            throw new error_response_1.UnauthorizedError("Shop not found", 401);
                        }
                        _c = crypto_1["default"].generateKeyPairSync("rsa", {
                            modulusLength: 4096,
                            publicKeyEncoding: {
                                type: "pkcs1",
                                format: "pem"
                            },
                            privateKeyEncoding: {
                                type: "pkcs1",
                                format: "pem"
                            }
                        }), privateKey = _c.privateKey, publicKey = _c.publicKey;
                        publicKeyString = publicKey.toString();
                        return [4 /*yield*/, authUtils_1.createTokenPair({ userId: shop._id, email: email }, publicKeyString, privateKey)];
                    case 3:
                        tokens = _d.sent();
                        data = {
                            userId: shop._id,
                            privateKey: privateKey,
                            publicKey: publicKey,
                            refreshToken: tokens.refreshToken
                        };
                        return [4 /*yield*/, keyToken_service_1["default"].createKeyToken(data)];
                    case 4:
                        _d.sent();
                        if (!publicKeyString) {
                            throw new error_response_1.BadRequestError("Error create key token", 500);
                        }
                        return [2 /*return*/, {
                                metadata: {
                                    shop: utils_1.getInfoData({
                                        fileds: ["_id", "name", "email"],
                                        object: shop
                                    }),
                                    tokens: tokens
                                }
                            }];
                }
            });
        });
    };
    return AccessService;
}());
exports["default"] = AccessService;
