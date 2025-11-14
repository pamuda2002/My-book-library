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


// find static files(CSS, Image)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//find the reason for this line
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books");

        const books = result.rows;
        res.render("index", {books: books});
    }catch(err){
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
    } catch (err){
        console.error("Error adding book:", err);
    }
})

app.listen(port, () => {
    console.log(`Sever running on http://localhost:${port}`);
});