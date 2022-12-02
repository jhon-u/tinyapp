const { users, urlDatabase } = require("../data/database");
const { generateRandomString, urlsForUser, checkIfURLExist } = require("../helpers");
const express = require("express");
// const cookieSession = require("cookie-session");
let router = express.Router();
// router.use(cookieSession({
//   name: "session",
//   keys: ["key1", "key2"],
// }));

router
  // .route("/")
  .post("/", (req, res) => {
    const userID = req.session.user_id;
    if (!userID) return res.status(401).send("<h2>You need to be logged in to create a new URL.</h2>");
    const randomStr = generateRandomString(6);
    const longURL = req.body.longURL;
    urlDatabase[randomStr] = {longURL, userID};
    console.log(urlDatabase);
    res.redirect(`/urls/${randomStr}`);
  })
  // .route("/")
  .get("/", (req, res) => {
    const user = req.session.user_id;
    console.log("INSIDE ROUTER", user);
    const urls = urlsForUser(user, urlDatabase);
    console.log("INSIDE ROUTER urls", urls);
    const templateVars = {
      user: users[user],
      urls
    };
    res.render("urls_index", templateVars);
  })

  /** Removes an existing shortened URLs from our database. */
  .post("/:id/delete", (req, res) => {
    const urlID = req.params.id;
    const urlExists = checkIfURLExist(urlDatabase, urlID);
    if (!urlExists) return res.status(400).send(`<h2>The URL ${urlID} does not exist.</h2>`);

    // const user = req.cookies["user_id"];
    const user = req.session.user_id;
    if (!user) return res.status(401).send("<h2>Must log in to be able to delete the URL.</h2>");

    const userURLs = urlsForUser(user, urlDatabase);
    const isOwn = checkIfURLExist(userURLs, urlID);
    if (!isOwn) return res.status(403).send("<h2>The selected URL does not belong to the user.</h2>");

    delete urlDatabase[urlID];
    res.redirect("/urls");
  })

  /** Updates an existing long URL in our database. */
  .post("/:id", (req, res) => {
  //return error if urlID does not exist
    const urlID = req.params.id;
    const urlExists = checkIfURLExist(urlDatabase, urlID);
    if (!urlExists) return res.status(400).send(`<h2>The URL ${urlID} does not exist.</h2>`);

    //should return a relevant error message if the user is not logged in
    // const user = req.cookies["user_id"];
    const user = req.session.user_id;
    if (!user) return res.status(401).send("<h2>Must log in to be able to edit the URL.</h2>");

    // should return a relevant error message if the user does not own the URL
    const userURLs = urlsForUser(user, urlDatabase);
    const isOwn = checkIfURLExist(userURLs, urlID);
    if (!isOwn) return res.status(403).send("<h2>The selected URL does not belong to the user.</h2>");

    const newURL = req.body.newURL;
    urlDatabase[urlID].longURL = newURL;
    res.redirect("/urls");
  })

  /** GET route to add new URLs. */
  .get("/new", (req, res) => {
  // const user = req.cookies["user_id"];
    const user = req.session.user_id;
    if (!user) return res.redirect("/login");
    const templateVars = {
      user: users[user],
      urls: urlDatabase
    };
    res.render("urls_new", templateVars);
  })

  /** GET route to load individual shortened URLs. */
  .get("/:id", (req, res) => {
  // const userID = req.cookies["user_id"];
    const userID = req.session.user_id;
    if (!userID) return res.send("<h2>Please log in to view or edit the URL.</h2>");

    const urls = urlsForUser(userID, urlDatabase);
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
module.exports = router;