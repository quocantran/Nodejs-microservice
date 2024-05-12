"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const config_mongodb_1 = __importDefault(require("./src/configs/config.mongodb"));
const { db } = config_mongodb_1.default;
const PORT = process.env.PORT || 3055;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");
    process.exit(1);
});
