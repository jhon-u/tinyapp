
/**
 * A full stack web app built with Node and Express that allows
 * users to shorten long URLs (à la bit.ly).
 */
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const { users, urlDatabase } = require("./data/database");

const app = express();
const PORT = 8080;
app.set("view engine", "ejs");

/** Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use(cookieSession({
  name: "session",
  keys: ["the_league", "passified"],
}));

const urls = require("./routes/urls");
const login = require("./routes/login");
const logout = require("./routes/logout");
const register = require("./routes/register");
app.use("/urls", urls);
app.use("/login", login);
app.use("/logout", logout);
app.use("/register", register);

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

/** Routes any 404 status to /404 view. */
app.use((req,res,next)=>{
  const user = req.session.user_id;
  const templateVars = { user: users[user] };
  res.status(404).render("404", templateVars);
  next();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});