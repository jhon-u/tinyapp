
/**
 * A full stack web app built with Node and Express that allows
 * users to shorten long URLs (à la bit.ly).
 */

const { generateRandomString, validateFields, getUserByEmail } = require("./helpers");
const { users, urlDatabase } = require("./data/database");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

// Middleware for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// POST Route
app.post("/urls", (req, res) => {
  const randomStr = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[randomStr] = longURL;
  res.redirect(`/urls/${randomStr}`);
});

// Route to handle a POST to /login
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("user_id", username);
  res.redirect("/urls");
});

// Route to handle a POST to /logout
app.post("/logout", (req, res) => {
  const username = req.body.username;
  res.clearCookie("user_id", username);
  res.redirect("/urls");
});

// Route to handle a POST to /register
app.post("/register", (req, res) => {
  const userID = generateRandomString(5);
  const email = req.body.email;
  const password = req.body.password;
  const isValid = validateFields(email, password);
  
  if (getUserByEmail(email) !== null) {
    res.status(400);
    res.send("Email already used!");
    return;
  }

  if (!isValid) {
    res.status(400);
    res.send("Shall no pass");
    return;
  }

  users[userID] = {
    id: userID,
    email,
    password
  };

  console.log(users);

  res.cookie("user_id", userID);
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
  const newURL = req.body.newURL;
  const id = req.params.id;
  urlDatabase[id] = newURL;
  res.redirect("/urls");
});

// GET Routes
// Path to view all the shorten and long URLs
app.get("/urls", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = {
    user: users[user],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Path to add new URLs
app.get("/urls/new", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = {
    user: users[user],
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

// Path to load individual shortened URL
app.get("/urls/:id", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[user],
  };
  res.render("urls_show", templateVars);
});

// Redirect any request to "/u/:id" to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = {
    user: users[user]
  };
  res.render("registration", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});