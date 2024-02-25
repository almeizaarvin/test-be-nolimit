import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from './db';

const app = express();
app.use(express.json());

const JWT_SECRET = 'SECRET';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    if (!decoded || typeof decoded.id !== 'number') {
      throw new Error('Invalid token');
    }

    req.userId = decoded.id.toString();
    next();

  } catch (error) {
    return res.status(403).send('Invalid token');
  }
};

app.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query('INSERT INTO users (name, email, password) VALUES (' + "'" + name + "', '" + email + "', '" + hashedPassword + "')", (error, results) => {
      if (error) {
        return res.status(500).send('Error registering user');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = ' + "'" + email + "'", async (error, results) => {
      if (error) {
        return res.status(500).send('Error logging in');
      }
      if (results.length === 0) {
        return res.status(401).send('Invalid email or password');
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Invalid email or password');
      }

      const tokenPayload = { id: user.id };
      jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          return res.status(500).send('Error generating token');
        }
        res.send({ token });
      });
    });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});
