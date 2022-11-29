const express = require("express");
const cookieParser = require("cookie-parser");
const {generateRandomString} = require("./helpers");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Middleware for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// POST Route
app.post("/urls", (req, res) => {
  const randomStr = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[randomStr] = longURL;
  res.redirect(`/urls/${randomStr}`);
});

// Route to handle a POST to /login
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

// Removes an existing shortened URLs from our database.
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Updates an existing long URL in our database.
app.post("/urls/:id", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const newURL = req.body.newURL;
  const id = req.params.id;
  urlDatabase[id] = newURL;
  res.redirect("/urls");
});

// GET Routes
// Path to view all the shorten and long URLs
app.get("/urls", (req, res) => {
  console.log(req.cookies);
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Path to add new URLs
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

// Path to load individual shortened URL
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

// Redirect any request to "/u/:id" to its longURL
app.get("/u/:id", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});