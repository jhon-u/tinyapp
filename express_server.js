
/**
 * A full stack web app built with Node and Express that allows
 * users to shorten long URLs (à la bit.ly).
 */


const express = require("express");
// const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");

const { users, urlDatabase } = require("./data/database");
const {
  generateRandomString,
  validateFields,
  getUserByEmail,
  urlsForUser,
  checkIfURLExist
} = require("./helpers");

const app = express();
const PORT = 8080;
app.set("view engine", "ejs");

/** Middleware */
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"],
}));
app.use(morgan("combined"));

/** Route to handle a POST to /urls. */
app.post("/urls", (req, res) => {
  // const userID = req.cookies["user_id"];
  const userID = req.session.user_id;
  if (!userID) return res.status(401).send("<h2>You need to be logged in to create a new URL.</h2>");

  const randomStr = generateRandomString(6);
  const longURL = req.body.longURL;
  
  urlDatabase[randomStr] = {longURL, userID};
  console.log(urlDatabase);
  res.redirect(`/urls/${randomStr}`);
});

/** Route to handle a POST to /login. */
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  
  if (user === null) {
    return res.status(403).send("<h2>Invalid Username!</h2>");
  }
  // if (user.password !== password) {
  //   return res.status(403).send("<h2>Passwords don't match!</h2>");
  // }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  console.log("passwordMatch", passwordMatch);
  if (!passwordMatch) {
    return res.status(403).send("<h2>Passwords don't match!</h2>");
  }

  // res.cookie("user_id", user.id);
  // eslint-disable-next-line camelcase
  req.session.user_id = user.id;
  res.redirect("/urls");
});

/** Route to handle a POST to /logout. */
app.post("/logout", (req, res) => {
  // res.clearCookie("user_id");
  req.session = null;
  res.redirect("/login");
});

/** Route to handle a POST to /register. */
app.post("/register", (req, res) => {
  const userID = generateRandomString(5);
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const isValid = validateFields(email, password);
  const user = getUserByEmail(email, users);
  console.log("PASSWORD", password);
  if (user !== null) {
    return res.status(400).send("<h2>Email already used!</h2>");
  }
  if (!isValid) {
    return res.status(400).send("<h2>Shall no pass</h2>");
  }

  users[userID] = {
    id: userID,
    email,
    password
  };

  console.log("USER", users);

  // res.cookie("user_id", userID);
  // eslint-disable-next-line camelcase
  req.session.user_id = userID;
  res.redirect("/urls");
});

/** Removes an existing shortened URLs from our database. */
app.post("/urls/:id/delete", (req, res) => {
  const urlID = req.params.id;
  const urlExists = checkIfURLExist(urlDatabase, urlID);
  if (!urlExists) return res.status(400).send(`<h2>The URL ${urlID} does not exist.</h2>`);

  // const user = req.cookies["user_id"];
  const user = req.session.user_id;
  if (!user) return res.status(401).send("<h2>Must log in to be able to delete the URL.</h2>");

  const userURLs = urlsForUser(user);
  const isOwn = checkIfURLExist(userURLs, urlID);
  if (!isOwn) return res.status(403).send("<h2>The selected URL does not belong to the user.</h2>");

  delete urlDatabase[urlID];
  res.redirect("/urls");
});

/** Updates an existing long URL in our database. */
app.post("/urls/:id", (req, res) => {
  //return error if urlID does not exist
  const urlID = req.params.id;
  const urlExists = checkIfURLExist(urlDatabase, urlID);
  if (!urlExists) return res.status(400).send(`<h2>The URL ${urlID} does not exist.</h2>`);

  //should return a relevant error message if the user is not logged in
  // const user = req.cookies["user_id"];
  const user = req.session.user_id;
  if (!user) return res.status(401).send("<h2>Must log in to be able to edit the URL.</h2>");

  // should return a relevant error message if the user does not own the URL
  const userURLs = urlsForUser(user);
  const isOwn = checkIfURLExist(userURLs, urlID);
  if (!isOwn) return res.status(403).send("<h2>The selected URL does not belong to the user.</h2>");

  const newURL = req.body.newURL;
  urlDatabase[urlID].longURL = newURL;
  res.redirect("/urls");
});

/** GET route to view all the shorten and long URLs. */
app.get("/urls", (req, res) => {
  // const user = req.cookies["user_id"];
  const user = req.session.user_id;
  const urls = urlsForUser(user);
  const templateVars = {
    user: users[user],
    urls
  };
  res.render("urls_index", templateVars);
});

/** GET route to add new URLs. */
app.get("/urls/new", (req, res) => {
  // const user = req.cookies["user_id"];
  const user = req.session.user_id;
  if (!user) return res.redirect("/login");
  const templateVars = {
    user: users[user],
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

/** GET route to load individual shortened URLs. */
app.get("/urls/:id", (req, res) => {
  // const userID = req.cookies["user_id"];
  const userID = req.session.user_id;
  if (!userID) return res.send("<h2>Please log in to view or edit the URL.</h2>");

  const urls = urlsForUser(userID);
  const urlID = req.params.id;
  const isOwn = checkIfURLExist(urls, urlID);
  
  console.log(urls);

  if (!isOwn) return res.send("<h2>The URL does not belong to the user or does not exist.</h2>");


  const templateVars = {
    urlID,
    longURL: urlDatabase[urlID].longURL,
    user: users[userID],
  };

  res.render("urls_show", templateVars);
});

/** Redirect any request to "/u/:id" to its longURL. */
app.get("/u/:id", (req, res) => {
  const urlID = req.params.id;
  const longURL = urlDatabase[urlID].longURL;
  if (!longURL) {
    res.set("Content-Type", "text/html");
    return res.send(`<h2>The short URL ${urlID} does not exist.</h2>`);
  }
  
  res.redirect(longURL);
});

/** GET route to handle reqeusts to /register. */
app.get("/register", (req, res) => {
  // const user = req.cookies["user_id"];
  const user = req.session.user_id;
  if (user) return res.redirect("/urls");
  const templateVars = {
    user: users[user]
  };
  res.render("registration", templateVars);
});

/** GET route to handle reqeusts to /login. */
app.get("/login", (req, res) => {
  // const user = req.cookies["user_id"];
  const user = req.session.user_id;
  if (user) return res.redirect("/urls");
  const templateVars = {
    user: users[user]
  };
  res.render("login", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});