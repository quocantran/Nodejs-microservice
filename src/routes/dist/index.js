"use strict";
exports.__esModule = true;
var express_1 = require("express");
var access_1 = require("./access");
var checkAuth_1 = require("../auth/checkAuth");
var router = express_1["default"].Router();
//check apikey
router.use(checkAuth_1.apiKey);
//check permission
router.use(checkAuth_1.checkPermission("0000"));
router.use("/api/v1", access_1["default"]);
exports["default"] = router;
