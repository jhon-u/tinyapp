
/**
 * A full stack web app built with Node and Express that allows
 * users to shorten long URLs (à la bit.ly).
 */

const { generateRandomString, validateFields, getUserByEmail } = require("./helpers");
const { users, urlDatabase } = require("./data/database");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
const PORT = 8080;
app.set("view engine", "ejs");

/** Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

/** Route to handle a POST to /urls. */
app.post("/urls", (req, res) => {
  const user = req.cookies["user_id"];
  if (!user) {
    res.set("Content-Type", "text/html");
    return res.send("<h2>You need to be logged in to create a new URL.</h2>");
  }
  const randomStr = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[randomStr] = longURL;
  res.redirect(`/urls/${randomStr}`);
});

/** Route to handle a POST to /login. */
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  
  if (user === null) {
    return res.status(403).send("Invalid Username or Password!");
  } else if (user.password !== password) {
    return res.status(403).send("Passwords don't match!");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

/** Route to handle a POST to /logout. */
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

/** Route to handle a POST to /register. */
app.post("/register", (req, res) => {
  const userID = generateRandomString(5);
  const email = req.body.email;
  const password = req.body.password;
  const isValid = validateFields(email, password);
  const user = getUserByEmail(email);

  if (user !== null) {
    return res.status(400).send("Email already used!");
  }
  if (!isValid) {
    return res.status(400).send("Shall no pass");
  }

  users[userID] = {
    id: userID,
    email,
    password
  };

  res.cookie("user_id", userID);
  res.redirect("/urls");
});

/** Removes an existing shortened URLs from our database. */
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

/** Updates an existing long URL in our database. */
app.post("/urls/:id", (req, res) => {
  const newURL = req.body.newURL;
  const id = req.params.id;
  urlDatabase[id] = newURL;
  res.redirect("/urls");
});

/** GET route to view all the shorten and long URLs. */
app.get("/urls", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = {
    user: users[user],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

/** GET route to add new URLs. */
app.get("/urls/new", (req, res) => {
  const user = req.cookies["user_id"];
  if (!user) return res.redirect("/login");
  const templateVars = {
    user: users[user],
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

/** GET route to load individual shortened URLs. */
app.get("/urls/:id", (req, res) => {
  const user = req.cookies["user_id"];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[user],
  };
  res.render("urls_show", templateVars);
});

/** Redirect any request to "/u/:id" to its longURL. */
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (!longURL) {
    res.set("Content-Type", "text/html");
    return res.send(`<h2>The short URL ${id} does not exist.</h2>`);
  }
  
  res.redirect(longURL);
});

/** GET route to handle reqeusts to /register. */
app.get("/register", (req, res) => {
  const user = req.cookies["user_id"];
  if (user) return res.redirect("/urls");
  const templateVars = {
    user: users[user]
  };
  res.render("registration", templateVars);
});

/** GET route to handle reqeusts to /login. */
app.get("/login", (req, res) => {
  const user = req.cookies["user_id"];
  if (user) return res.redirect("/urls");
  const templateVars = {
    user: users[user]
  };
  res.render("login", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});