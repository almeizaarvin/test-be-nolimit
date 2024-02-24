"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send({
        message: 'Hai',
        data: req.params.id
    });
});
app.post('/', (req, res) => {
    res.send({
        data: req.body
    });
});
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
