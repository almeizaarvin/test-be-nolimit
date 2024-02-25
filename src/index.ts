import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from './db'; // Import the database connection pool

const app = express();
app.use(express.json())

app.get('/posts', (req: Request, res: Response) => {
    try {
      pool.query('SELECT * FROM posts', (error, results) => {
        if (error) {
          console.log('Error fetching posts:', error);
          return res.status(500).send('Error fetching posts');
        }
        res.send(results);
      });
    } catch (error) {
      console.log('Error fetching posts:', error);
      res.status(500).send('Error fetching posts');
    }
  });
  

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
