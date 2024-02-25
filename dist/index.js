"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db")); // Import the database connection pool
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/posts', (req, res) => {
    try {
        db_1.default.query('SELECT * FROM posts', (error, results) => {
            if (error) {
                console.log('Error fetching posts:', error);
                return res.status(500).send('Error fetching posts');
            }
            res.send(results);
        });
    }
    catch (error) {
        console.log('Error fetching posts:', error);
        res.status(500).send('Error fetching posts');
    }
});
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
