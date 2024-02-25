"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
// Create a MySQL connection pool
const pool = mysql_1.default.createPool({
    host: '127.0.0.1',
    user: 'root@localhost',
    password: 'password',
    database: 'blog_db'
});
exports.default = pool;
