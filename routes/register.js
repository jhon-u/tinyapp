const { users } = require("../data/database");
const { getUserByEmail, validateFields, generateRandomString } = require("../helpers");
const express = require("express");
const bcrypt = require("bcryptjs");
const { body, check, validationResult } = require("express-validator");
let router = express.Router();

router
  /** Route to handle a POST to /register. */
  .post("/", (req, res) => {
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
  })

  /** GET route to handle reqeusts to /register. */
  .get("/", (req, res) => {
  // const user = req.cookies["user_id"];
    const user = req.session.user_id;
    if (user) return res.redirect("/urls");
    const templateVars = {
      user: users[user]
    };
    res.render("registration", templateVars);
  });

module.exports = router;