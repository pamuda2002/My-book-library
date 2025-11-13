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

db.connect();

// find static files(CSS, Image)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//find the reason for this line
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
})

app.listen(port, ()=> {
    console.log(`Sever running on http://localhost:${port}`);
});