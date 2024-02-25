# test-be-nolimit

Simple application built with Node.js, Express.js, MySQL, JWT authentication, and bcrypt password hashing.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/blog-app.git
   cd blog-app

2. **Install dependencies:**
   ```bash
    npm install

3. **Setup Environment:**
    in the .env file, insert your local MySQL environment data. For example: 
    ```bash
    DB_HOST=127.0.0.1
    DB_USER=root
    DB_PASSWORD=password
    DB_DATABASE=blog_db
    JWT_SECRET=YourSecretKey


## Database Setup
1. **Make sure you have MySQL installed locally**
2. **Create a MySQL database and set it to env also**
3. **Create a new table using this query**
    ```bash
    CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
    );

    CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    authorId INT NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users(id)
    );

## Starting the app

1. **First build**
    ```bash
    npm run build

1. **Run on dev**
    ```bash
    npm run dev