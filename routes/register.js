const { users } = require("../data/database");
const { getUserByEmail, generateRandomString } = require("../helpers");
const express = require("express");
const bcrypt = require("bcryptjs");
const { body, check, validationResult } = require("express-validator");
let router = express.Router();

router
  /** Route to handle a POST to /register. */
  .post("/", [
    check("password").notEmpty().withMessage("The password field cannot be empty!"),
    body("email")
      .custom((value, { req }) => {
        const email = req.body.email;
        const user = getUserByEmail(email, users);
        if (user !== null) {
          throw new Error("Email already used!");
        }
        if (!value) {
          throw new Error("The email field cannot be empty!");
        }
        return true;
      })
  ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const templateVars = {
        user: users[req.session.userID],
        errors: errors.array()
      };
      res.status(403);
      return res.render("register", templateVars);
    }

    const userID = generateRandomString(5);
    users[userID] = {
      id: userID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.userID = userID;
    res.redirect("/urls");
  })

  /** GET route to handle reqeusts to /register. */
  .get("/", (req, res) => {
    const user = req.session.userID;
    if (user) return res.redirect("/urls");
    const templateVars = {
      user: users[user],
      errors: null
    };
    res.render("register", templateVars);
    req.session.errors = null;
  });

module.exports = router;