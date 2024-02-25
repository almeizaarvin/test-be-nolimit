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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("./db")); // Import the database connection pool
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Secret key for JWT
const JWT_SECRET = 'your_secret_key';
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.headers.userId = decoded.id.toString();
        next();
    }
    catch (error) {
        return res.status(403).send('Invalid token');
    }
};
// User registration endpoint
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Insert the user into the database
        db_1.default.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (error, results) => {
            if (error) {
                console.error('Error registering user:', error);
                return res.status(500).send('Error registering user');
            }
            res.status(201).send('User registered successfully');
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
}));
// User login endpoint
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user exists
        db_1.default.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error('Error logging in:', error);
                return res.status(500).send('Error logging in');
            }
            if (results.length === 0) {
                return res.status(401).send('Invalid email or password');
            }
            // Verify password
            const user = results[0];
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send('Invalid email or password');
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET);
            res.send({ token });
        }));
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
}));
// Get all posts endpoint
app.get('/posts', (req, res) => {
    try {
        db_1.default.query('SELECT * FROM posts', (error, results) => {
            if (error) {
                console.error('Error fetching posts:', error);
                return res.status(500).send('Error fetching posts');
            }
            res.send(results);
        });
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Error fetching posts');
    }
});
// Get post by ID endpoint
app.get('/posts/:id', (req, res) => {
    try {
        const postId = req.params.id;
        db_1.default.query('SELECT * FROM posts WHERE id = ?', [postId], (error, results) => {
            if (error) {
                console.error('Error fetching post:', error);
                return res.status(500).send('Error fetching post');
            }
            res.send(results[0]);
        });
    }
    catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Error fetching post');
    }
});
// Create post endpoint (requires authentication)
app.post('/posts', verifyToken, (req, res) => {
    try {
        const { content } = req.body;
        const authorId = req.headers.userId;
        db_1.default.query('INSERT INTO posts (content, authorId) VALUES (?, ?)', [content, authorId], (error, results) => {
            if (error) {
                console.error('Error creating post:', error);
                return res.status(500).send('Error creating post');
            }
            res.status(201).send('Post created successfully');
        });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Error creating post');
    }
});
// Update post endpoint (requires authentication and authorization)
app.put('/posts/:id', verifyToken, (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const authorId = req.headers.userId;
        db_1.default.query('UPDATE posts SET content = ? WHERE id = ? AND authorId = ?', [content, postId, authorId], (error, results) => {
            if (error) {
                console.error('Error updating post:', error);
                return res.status(500).send('Error updating post');
            }
            res.send('Post updated successfully');
        });
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Error updating post');
    }
});
// Delete post endpoint (requires authentication and authorization)
app.delete('/posts/:id', verifyToken, (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.headers.userId;
        db_1.default.query('DELETE FROM posts WHERE id = ? AND authorId = ?', [postId, authorId], (error, results) => {
            if (error) {
                console.error('Error deleting post:', error);
                return res.status(500).send('Error deleting post');
            }
            res.send('Post deleted successfully');
        });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('Error deleting post');
    }
});
// Start the server
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
