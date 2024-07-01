"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DEV_PORT, DB_NAME, DB_USERNAME, DB_HOST, DB_PASSWORD } = process.env;
console.log('Running in dev mode');
exports.default = {
    DB_PORT: DEV_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_HOST,
    DB_PASSWORD
};
