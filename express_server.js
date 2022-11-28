const express = require('express');
const {generateRandomString} = require('helpers');
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Middleware for POST requests
app.use(express.urlencoded({ extended: true }));

// POST Routes
app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

// GET Routes: Path to view all the shorten and long URLs
app.get("/urls", (req, res) => {
  console.log(req.body);
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET Routes: Path to add new URLs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// GET Routes: Path to load individual shortened URL
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});