# MyBook

MyBook is a web application for managing a collection of books. It allows users to view, add, edit, and delete book entries.

## Features

- View a list of books. with sorting
- Add new books with details.
- Edit existing book details.
- Delete books from the collection.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **EJS (Embedded JavaScript)**: Templating engine for rendering dynamic HTML.
- **PostgreSQL (pg)**: Relational database for storing book information.
- **body-parser**: Middleware to parse incoming request bodies.
- **dotenv**: Loads environment variables from a `.env` file.
- **CSS**: For styling the application.

## Setup and Installation

To get this project up and running on your local machine, follow these steps:

### Prerequisites

- Node.js (LTS version recommended)
- PostgreSQL

### 1. Clone the repository

```bash
git clone <repository-url>
cd MyBook
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Setup

- Create a PostgreSQL database.
- Create a `.env` file in the root directory of the project and add your database connection details:

```
DB_USER=your_username
DB_HOST=your_host
DB_DATABASE=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
```

### 4. Run Database Migrations (if any)

_Note: This project currently does not include explicit database migration scripts. You might need to manually create the `books` table in your PostgreSQL database with appropriate columns (e.g., `id`, `title`, `author`, `isbn`, `description`)._

Example `books` table schema:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20),
    rating INT,
    notes TEXT,
    date_read DATE
);
```

## How to Run the Application

```bash
npm start
```

The application will typically run on `http://localhost:3000` (or another port if configured in your environment variables).

## Author

ArryZ
