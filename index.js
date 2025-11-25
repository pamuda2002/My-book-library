import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "mybooks",
    password: process.env.dbPassword,
    port: 5432,
});

db.connect()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error("Database connection error:", err));;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const sort = req.query.sort;
    let query = "SELECT * FROM books";

    if (sort === "rating"){
        query += " ORDER BY rating DESC";
    } else if ( sort === "recency"){
        query += " ORDER BY date_read DESC";
    }

    try {
        const result = await db.query(query);
        const books = result.rows;
        res.render("index", { books: books });
    } catch (err) {
        console.error("Error fetching books:", err);
    }
});

app.get("/new", (req, res) => {
    res.render("new");
});

app.post("/add", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const isbn = req.body.isbn;
    const rating = parseInt(req.body.rating);
    const dateRead = req.body.date_read;
    const notes = req.body.notes;

    try {
        // We use $1, $2, etc. to prevent SQL Injection
        const query = `
        INSERT INTO books (title, author, isbn, rating, date_read, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await db.query(query, [title, author, isbn, rating, dateRead, notes]);
        res.redirect("/")
    } catch (err) {
        console.error("Error adding book:", err);
    }
});

app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        const book = result.rows[0]; // Get the first (and only) book
        res.render("edit.ejs", { book: book });
    } catch (err) {
        console.error("Error fetching book for edit:", err);
    }

});

app.post("/update", async (req, res) => {
  const id = req.body.bookId;
  const { title, author, isbn, rating, date_read, notes } = req.body;

  try {
    const query = `
      UPDATE books
      SET title = $1, author = $2, isbn = $3, rating = $4, date_read = $5, notes = $6
      WHERE id = $7
    `;
    await db.query(query, [title, author, isbn, rating, date_read, notes, id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error updating book:", err);
  }
});

app.post("/delete", async (req, res) => {
    const id = req.body.bookId;
    try {
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting book:", err);
    }
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Sever running on http://localhost:${port}`);
    });
}

export default app;